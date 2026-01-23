import { SocialPlatform } from "@acme/db/schema";
import { cn } from "@acme/ui";
import { Button, buttonVariants } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Checkbox } from "@acme/ui/checkbox";
import { useAppForm } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Switch } from "@acme/ui/switch";
import { Textarea } from "@acme/ui/textarea";
import { useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  Clock,
  ImagePlus,
  Send,
  Share2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { MAX_IMAGE_SIZE, VALID_IMAGE_TYPES } from "~/lib/constants";
import { useTRPC } from "~/lib/trpc";

type MediaItem = {
  base64: string;
  preview: string;
  fileName: string;
};

function processMediaFile(
  file: File,
  onSuccess: (media: MediaItem) => void
): void {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    toast.error(`Invalid file type: ${file.name}`);
    return;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    toast.error(`File too large: ${file.name} (max 5MB)`);
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result as string;
    const base64Data = base64String.split(",")[1] ?? "";
    onSuccess({
      base64: base64Data,
      preview: base64String,
      fileName: file.name,
    });
  };
  reader.readAsDataURL(file);
}

export const Route = createFileRoute(
  "/(dashboard)/marketing/social/posts/create"
)({
  component: CreateSocialPostPage,
  head: () => ({
    meta: [{ title: "Create Social Post | Social Marketing" }],
  }),
});

function CreateSocialPostPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    ...trpc.socialMarketing.createMultiple.mutationOptions(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(trpc.socialMarketing.pathFilter());
      const postCount = data.length;
      toast.success(
        postCount === 1
          ? "Post created successfully"
          : `${postCount} posts created successfully`
      );
      form.reset();
      if (postCount === 1 && data[0]) {
        router.navigate({
          to: "/marketing/social/posts/$postId",
          params: { postId: data[0].id },
        });
      } else {
        router.navigate({ to: "/marketing/social" });
      }
    },
    onError: () => {
      toast.error("Failed to create posts");
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      platforms: [] as SocialPlatform[],
      content: "",
      media: [] as MediaItem[],
      // Scheduling
      scheduleEnabled: false,
      scheduleDate: undefined as Date | undefined,
      scheduleHour: "09",
      scheduleMinute: "00",
    },
    validators: {
      onChange: ({ value }) => {
        const errors: Record<string, string> = {};

        if (value.platforms.length === 0) {
          errors.platforms = "Select at least one platform";
        }

        if (!value.content.trim()) {
          errors.content = "Post content is required";
        }

        // Check character limit for each selected platform
        if (
          value.platforms.includes(SocialPlatform.TWITTER) &&
          value.content.length > 280
        ) {
          errors.content = `Twitter posts must be 280 characters or less (currently ${value.content.length})`;
        }

        return Object.keys(errors).length > 0 ? errors : undefined;
      },
    },
    onSubmit: ({ value }) => {
      // Build scheduled date/time if scheduling is enabled
      let scheduledAt: Date | undefined;
      if (value.scheduleEnabled && value.scheduleDate) {
        scheduledAt = new Date(value.scheduleDate);
        scheduledAt.setHours(
          Number.parseInt(value.scheduleHour, 10),
          Number.parseInt(value.scheduleMinute, 10),
          0,
          0
        );

        const minScheduleTime = new Date(Date.now() + 5 * 60 * 1000);
        if (scheduledAt < minScheduleTime) {
          toast.error(
            "Scheduled time must be at least 5 minutes in the future"
          );
          return;
        }
      }

      createPostMutation.mutate({
        name: value.name || "Untitled Post",
        description: value.description || "",
        platforms: value.platforms,
        content: value.content,
        mediaBase64: value.media.map((m) => m.base64),
        scheduledAt,
      });
    },
  });

  const platforms = useStore(form.store, (s) => s.values.platforms);
  const content = useStore(form.store, (s) => s.values.content);
  const media = useStore(form.store, (s) => s.values.media);
  const scheduleEnabled = useStore(form.store, (s) => s.values.scheduleEnabled);

  const handleMediaUpload = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const remainingSlots = 4 - media.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 4 media items allowed");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    for (const file of filesToProcess) {
      processMediaFile(file, (newMedia) => {
        const currentMedia = form.getFieldValue("media");
        form.setFieldValue("media", [...currentMedia, newMedia]);
      });
    }
  };

  const removeMedia = (index: number) => {
    const currentMedia = form.getFieldValue("media");
    form.setFieldValue(
      "media",
      currentMedia.filter((_, i) => i !== index)
    );
  };

  const getCharacterLimit = (selectedPlatforms: SocialPlatform[]) => {
    if (selectedPlatforms.length === 0) {
      return 0;
    }
    // Return the most restrictive (smallest) limit
    const limits = selectedPlatforms.map((p) => {
      switch (p) {
        case SocialPlatform.TWITTER:
          return 280;
        case SocialPlatform.LINKEDIN:
          return 3000;
        case SocialPlatform.FACEBOOK:
          return 63_206;
        case SocialPlatform.DEVTO:
          return 100_000;
        default:
          return Number.MAX_SAFE_INTEGER;
      }
    });
    return Math.min(...limits);
  };

  const characterLimit = getCharacterLimit(platforms);
  const characterCount = content.length;
  const isOverLimit = characterLimit > 0 && characterCount > characterLimit;

  const platformOptions = [
    { value: SocialPlatform.TWITTER, label: "Twitter", charLimit: 280 },
    { value: SocialPlatform.LINKEDIN, label: "LinkedIn", charLimit: 3000 },
    { value: SocialPlatform.FACEBOOK, label: "Facebook", charLimit: 63_206 },
    { value: SocialPlatform.DEVTO, label: "Dev.to", charLimit: 100_000 },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4"
          )}
          to="/marketing/social"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Social Marketing
        </Link>
        <h2 className="font-bold text-2xl tracking-tight">
          Create Social Post
        </h2>
        <p className="text-muted-foreground">
          Create a new post for your social media platforms
        </p>
      </div>

      <form.AppForm>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* Post Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Post Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.AppField name="name">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Post Name (Optional)</field.FormLabel>
                    <Input
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Weekly Update"
                      value={field.state.value}
                    />
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>

              <form.AppField name="platforms">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Platforms *</field.FormLabel>
                    <p className="mb-3 text-muted-foreground text-sm">
                      Select one or more platforms to post to
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {platformOptions.map((option) => (
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                            platforms.includes(option.value) &&
                              "border-primary bg-primary/5"
                          )}
                          htmlFor={`platform-${option.value}`}
                          key={option.value}
                        >
                          <Checkbox
                            checked={platforms.includes(option.value)}
                            id={`platform-${option.value}`}
                            onCheckedChange={(checked) => {
                              const current = form.getFieldValue("platforms");
                              if (checked) {
                                form.setFieldValue("platforms", [
                                  ...current,
                                  option.value,
                                ]);
                              } else {
                                form.setFieldValue(
                                  "platforms",
                                  current.filter((p) => p !== option.value)
                                );
                              }
                            }}
                          />
                          <div className="flex-1">
                            <span className="font-medium">{option.label}</span>
                            <p className="text-muted-foreground text-xs">
                              {option.charLimit.toLocaleString()} character
                              limit
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Description (Optional)</field.FormLabel>
                    <Input
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Internal notes about this post..."
                      value={field.state.value}
                    />
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </CardContent>
          </Card>

          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.AppField name="content">
                {(field) => (
                  <field.FormItem>
                    <div className="flex items-center justify-between">
                      <field.FormLabel>Content *</field.FormLabel>
                      {characterLimit > 0 && (
                        <span
                          className={cn(
                            "text-sm",
                            isOverLimit
                              ? "text-destructive"
                              : "text-muted-foreground"
                          )}
                        >
                          {characterCount} / {characterLimit}
                        </span>
                      )}
                    </div>
                    <Textarea
                      className={cn(
                        "min-h-[150px]",
                        isOverLimit && "border-destructive"
                      )}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="What's on your mind?"
                      value={field.state.value}
                    />
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>

              {/* Media Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Media (Optional)</Label>
                  <div className="relative">
                    <Input
                      accept={VALID_IMAGE_TYPES.join(",")}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      multiple
                      onChange={(e) => handleMediaUpload(e.target.files)}
                      type="file"
                    />
                    <Button size="sm" type="button" variant="outline">
                      <ImagePlus className="mr-1 h-3 w-3" />
                      Add Media
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  Upload up to 4 images. Supported formats: JPEG, PNG, GIF, WebP
                </p>

                {media.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {media.map((item, itemIndex) => (
                      <div className="group relative" key={item.preview}>
                        <img
                          alt={item.fileName}
                          className="h-24 w-full rounded border object-cover"
                          height={96}
                          src={item.preview}
                          width={96}
                        />
                        <Button
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => removeMedia(itemIndex)}
                          size="icon"
                          type="button"
                          variant="destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField name="scheduleEnabled">
                {(field) => (
                  <div
                    className={cn(
                      "rounded-lg border-2 p-6 transition-colors",
                      field.state.value
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "rounded-lg p-3",
                            field.state.value ? "bg-primary/20" : "bg-muted"
                          )}
                        >
                          <CalendarIcon
                            className={cn(
                              "h-6 w-6",
                              field.state.value
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div>
                          <Label
                            className="font-medium text-base"
                            htmlFor="schedule-toggle"
                          >
                            Schedule for later
                          </Label>
                          <p className="text-muted-foreground text-sm">
                            {field.state.value
                              ? "Post will be published at the scheduled time"
                              : "Post will be saved as a draft"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={field.state.value}
                        id="schedule-toggle"
                        onCheckedChange={field.handleChange}
                      />
                    </div>

                    {field.state.value && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <form.AppField name="scheduleDate">
                          {(dateField) => (
                            <div className="space-y-2">
                              <Label>Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !dateField.state.value &&
                                        "text-muted-foreground"
                                    )}
                                    variant="outline"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateField.state.value ? (
                                      format(dateField.state.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="start"
                                  className="w-auto p-0"
                                >
                                  <Calendar
                                    disabled={(date) => date < new Date()}
                                    mode="single"
                                    onSelect={dateField.handleChange}
                                    selected={dateField.state.value}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}
                        </form.AppField>

                        <div className="space-y-2">
                          <Label>Time</Label>
                          <div className="flex gap-2">
                            <form.AppField name="scheduleHour">
                              {(hourField) => (
                                <Select
                                  onValueChange={hourField.handleChange}
                                  value={hourField.state.value}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Hour" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 24 }, (_, i) => {
                                      const hour = i
                                        .toString()
                                        .padStart(2, "0");
                                      return (
                                        <SelectItem key={hour} value={hour}>
                                          {hour}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              )}
                            </form.AppField>
                            <span className="flex items-center text-muted-foreground text-xl">
                              :
                            </span>
                            <form.AppField name="scheduleMinute">
                              {(minuteField) => (
                                <Select
                                  onValueChange={minuteField.handleChange}
                                  value={minuteField.state.value}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {["00", "15", "30", "45"].map((minute) => (
                                      <SelectItem key={minute} value={minute}>
                                        {minute}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </form.AppField>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form.AppField>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link to="/marketing/social">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              disabled={
                createPostMutation.isPending ||
                isOverLimit ||
                platforms.length === 0
              }
              type="submit"
            >
              <Send className="mr-2 h-4 w-4" />
              {createPostMutation.isPending && "Creating..."}
              {!createPostMutation.isPending &&
                scheduleEnabled &&
                (platforms.length > 1
                  ? `Create & Schedule ${platforms.length} Posts`
                  : "Create & Schedule")}
              {!(createPostMutation.isPending || scheduleEnabled) &&
                (platforms.length > 1
                  ? `Create ${platforms.length} Drafts`
                  : "Create Draft")}
            </Button>
          </div>
        </form>
      </form.AppForm>
    </>
  );
}
