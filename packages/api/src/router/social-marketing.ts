import {
  CreateSocialMediaPostSchema,
  ScheduleSocialPostSchema,
  SocialPlatform,
  SocialPostStatus,
  socialMediaPosts,
  UpdateSocialMediaPostSchema,
} from "@acme/db/schema";
import {
  getSocialMediaService,
  retrySocialPost,
  TwitterService,
} from "@acme/marketing";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { uploadImage } from "../s3";
import { protectedProcedure } from "../trpc";

export const socialMarketingRouter = {
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.socialMediaPosts.findMany({
      orderBy: desc(socialMediaPosts.createdAt),
      with: {
        createdBy: true,
      },
    })
  ),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) =>
      ctx.db.query.socialMediaPosts.findFirst({
        where: eq(socialMediaPosts.id, input.id),
        with: {
          createdBy: true,
        },
      })
    ),

  create: protectedProcedure
    .input(
      CreateSocialMediaPostSchema.omit({ mediaUrls: true }).extend({
        mediaBase64: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { mediaBase64, scheduledAt, ...postData } = input;
      let mediaUrls: string[] | undefined;

      if (mediaBase64 && mediaBase64.length > 0) {
        const timestamp = Date.now();
        mediaUrls = await Promise.all(
          mediaBase64.map(async (base64, mediaIndex) => {
            const slug = `social-post-${timestamp}-media${mediaIndex}`;
            return await uploadImage("social-media-posts", base64, slug);
          })
        );
      }

      const status = scheduledAt
        ? SocialPostStatus.SCHEDULED
        : SocialPostStatus.DRAFT;

      const [socialPost] = await ctx.db
        .insert(socialMediaPosts)
        .values({
          ...postData,
          mediaUrls,
          scheduledAt,
          status,
          createdById: ctx.session.user.id,
        })
        .returning();

      if (!socialPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create social post",
        });
      }

      return socialPost;
    }),

  createMultiple: protectedProcedure
    .input(
      CreateSocialMediaPostSchema.omit({
        mediaUrls: true,
        platform: true,
      }).extend({
        platforms: z
          .array(z.nativeEnum(SocialPlatform))
          .min(1, "At least one platform is required"),
        mediaBase64: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { mediaBase64, scheduledAt, platforms, ...postData } = input;
      let mediaUrls: string[] | undefined;

      if (mediaBase64 && mediaBase64.length > 0) {
        const timestamp = Date.now();
        mediaUrls = await Promise.all(
          mediaBase64.map(async (base64, mediaIndex) => {
            const slug = `social-post-${timestamp}-media${mediaIndex}`;
            return await uploadImage("social-media-posts", base64, slug);
          })
        );
      }

      const status = scheduledAt
        ? SocialPostStatus.SCHEDULED
        : SocialPostStatus.DRAFT;

      const posts = await ctx.db
        .insert(socialMediaPosts)
        .values(
          platforms.map((platform) => ({
            ...postData,
            platform,
            mediaUrls,
            scheduledAt,
            status,
            createdById: ctx.session.user.id,
          }))
        )
        .returning();

      if (posts.length === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create social posts",
        });
      }

      return posts;
    }),

  update: protectedProcedure
    .input(
      UpdateSocialMediaPostSchema.omit({ mediaUrls: true }).extend({
        mediaBase64: z.array(z.string()).optional(),
        keepExistingMedia: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, mediaBase64, keepExistingMedia, ...postData } = input;

      const existing = await ctx.db.query.socialMediaPosts.findFirst({
        where: eq(socialMediaPosts.id, id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Only draft or scheduled posts can be edited
      if (
        existing.status !== SocialPostStatus.DRAFT &&
        existing.status !== SocialPostStatus.SCHEDULED &&
        existing.status !== SocialPostStatus.FAILED
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only draft, scheduled, or failed posts can be edited",
        });
      }

      let mediaUrls: string[] | undefined = keepExistingMedia
        ? existing.mediaUrls || undefined
        : undefined;

      if (mediaBase64 && mediaBase64.length > 0) {
        const timestamp = Date.now();
        const newMediaUrls = await Promise.all(
          mediaBase64.map(async (base64, mediaIndex) => {
            const slug = `social-post-${id}-media${mediaIndex}-${timestamp}`;
            return await uploadImage("social-media-posts", base64, slug);
          })
        );
        mediaUrls = keepExistingMedia
          ? [...(mediaUrls || []), ...newMediaUrls]
          : newMediaUrls;
      }

      const [post] = await ctx.db
        .update(socialMediaPosts)
        .set({ ...postData, mediaUrls })
        .where(eq(socialMediaPosts.id, id))
        .returning();

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(socialMediaPosts)
        .where(eq(socialMediaPosts.id, input.id));

      return { success: true };
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.socialMediaPosts.findFirst({
        where: eq(socialMediaPosts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Social media post not found",
        });
      }

      if (post.status === SocialPostStatus.PUBLISHED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post is already published",
        });
      }

      if (
        post.status !== SocialPostStatus.DRAFT &&
        post.status !== SocialPostStatus.FAILED
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only draft or failed posts can be published immediately",
        });
      }

      await ctx.db
        .update(socialMediaPosts)
        .set({ status: SocialPostStatus.PUBLISHING })
        .where(eq(socialMediaPosts.id, input.id));

      const service = getSocialMediaService(post.platform);

      const result = await service.post({
        content: post.content,
        mediaUrls: post.mediaUrls || undefined,
        metadata:
          post.platform === "devto"
            ? { title: post.content.split("\n")[0] || "Untitled" }
            : undefined,
      });

      if (!result.success) {
        // Mark as failed
        await ctx.db
          .update(socialMediaPosts)
          .set({
            status: SocialPostStatus.FAILED,
            failureReason: result.error || "Failed to publish post",
          })
          .where(eq(socialMediaPosts.id, input.id));

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to publish post",
        });
      }

      // Update post with external ID and URL
      const [updatedPost] = await ctx.db
        .update(socialMediaPosts)
        .set({
          status: SocialPostStatus.PUBLISHED,
          publishedAt: new Date(),
          externalPostId: result.postId,
          postUrl: result.postUrl,
          failureReason: null,
        })
        .where(eq(socialMediaPosts.id, input.id))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update post after publishing",
        });
      }

      return updatedPost;
    }),

  schedule: protectedProcedure
    .input(ScheduleSocialPostSchema)
    .mutation(async ({ ctx, input }) => {
      // Validate scheduled time is at least 5 minutes in the future
      const minScheduleTime = new Date(Date.now() + 5 * 60 * 1000);
      if (input.scheduledAt < minScheduleTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scheduled time must be at least 5 minutes in the future",
        });
      }

      const post = await ctx.db.query.socialMediaPosts.findFirst({
        where: eq(socialMediaPosts.id, input.postId),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Social media post not found",
        });
      }

      // Only draft or already scheduled posts can be (re)scheduled
      const canSchedule =
        post.status === SocialPostStatus.DRAFT ||
        post.status === SocialPostStatus.SCHEDULED ||
        !post.status;

      if (!canSchedule) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only draft or scheduled posts can be rescheduled",
        });
      }

      const [updatedPost] = await ctx.db
        .update(socialMediaPosts)
        .set({
          status: SocialPostStatus.SCHEDULED,
          scheduledAt: input.scheduledAt,
        })
        .where(eq(socialMediaPosts.id, input.postId))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to schedule post",
        });
      }

      return updatedPost;
    }),

  cancelSchedule: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.socialMediaPosts.findFirst({
        where: eq(socialMediaPosts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Social media post not found",
        });
      }

      // Only scheduled posts can have their schedule cancelled
      if (post.status !== SocialPostStatus.SCHEDULED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only scheduled posts can be cancelled",
        });
      }

      const [updatedPost] = await ctx.db
        .update(socialMediaPosts)
        .set({
          status: SocialPostStatus.DRAFT,
          scheduledAt: null,
        })
        .where(eq(socialMediaPosts.id, input.id))
        .returning();

      if (!updatedPost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel post schedule",
        });
      }

      return updatedPost;
    }),

  retry: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await retrySocialPost(input.id);

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message,
        });
      }

      return result;
    }),

  refreshMetrics: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.socialMediaPosts.findFirst({
        where: eq(socialMediaPosts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Social media post not found",
        });
      }

      if (
        !(post.status === SocialPostStatus.PUBLISHED && post.externalPostId)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post is not published or missing external ID",
        });
      }

      // Only Twitter supports metrics fetching for now
      if (post.platform !== "twitter") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Metrics refresh not supported for ${post.platform}`,
        });
      }

      const service = getSocialMediaService(post.platform);

      if (!("getMetrics" in service)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Platform does not support metrics",
        });
      }

      const metrics = await (service as TwitterService).getMetrics(
        post.externalPostId
      );

      const [updatedPost] = await ctx.db
        .update(socialMediaPosts)
        .set({
          likes: metrics.likes,
          shares: metrics.shares,
          comments: metrics.comments,
          impressions: metrics.impressions,
        })
        .where(eq(socialMediaPosts.id, input.id))
        .returning();

      return updatedPost;
    }),

  getAnalytics: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.socialMediaPosts.findFirst({
        where: eq(socialMediaPosts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return {
        post,
        stats: {
          platform: post.platform,
          likes: post.likes,
          shares: post.shares,
          comments: post.comments,
          impressions: post.impressions,
          status: post.status,
          scheduledAt: post.scheduledAt,
          publishedAt: post.publishedAt,
          postUrl: post.postUrl,
        },
      };
    }),
} satisfies TRPCRouterRecord;
