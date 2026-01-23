import { EmailCampaignType } from "@acme/db/schema";
import { cn } from "@acme/ui";
import { Button, buttonVariants } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
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
import {
  ClientOnly,
  createFileRoute,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Clock, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/lib/trpc";

type NewContentType = "blog" | "project" | "snippet";

function EmailPreviewContent({
  isRendering,
  previewHtml,
}: Readonly<{
  isRendering: boolean;
  previewHtml: string;
}>) {
  if (isRendering) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Rendering preview...
      </div>
    );
  }

  if (previewHtml) {
    return (
      <iframe
        className="h-full min-h-[400px] w-full border-0"
        sandbox="allow-same-origin"
        srcDoc={previewHtml}
        title="Email Preview"
      />
    );
  }

  return (
    <div className="flex h-[400px] items-center justify-center text-muted-foreground">
      Fill in the fields above to see a preview
    </div>
  );
}

function getSubmitButtonText(isPending: boolean, scheduleEnabled: boolean) {
  if (isPending) {
    return "Creating...";
  }
  if (scheduleEnabled) {
    return "Create & Schedule";
  }
  return "Create Draft";
}

export const Route = createFileRoute(
  "/(dashboard)/marketing/email/campaigns/create"
)({
  component: CreateEmailCampaignPage,
  head: () => ({
    meta: [{ title: "Create Email Campaign | Email Marketing" }],
  }),
});

function CreateEmailCampaignPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);

  const createCampaignMutation = useMutation({
    ...trpc.emailMarketing.createWithTemplate.mutationOptions(),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(trpc.emailMarketing.pathFilter());
      toast.success("Campaign created successfully");
      form.reset();
      router.navigate({
        to: "/marketing/email/campaigns/$campaignId",
        params: { campaignId: data.id },
      });
    },
    onError: () => {
      toast.error("Failed to create campaign");
    },
  });

  const renderPreviewMutation = useMutation({
    ...trpc.emailMarketing.renderPreview.mutationOptions(),
    onMutate: () => {
      setIsRenderingPreview(true);
    },
    onSuccess: (html) => {
      setPreviewHtml(html);
    },
    onError: () => {
      setPreviewHtml("");
    },
    onSettled: () => {
      setIsRenderingPreview(false);
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      emailType: EmailCampaignType.NEWSLETTER,
      subject: "",
      htmlContent: "",
      previewText: "",
      // NEW_CONTENT specific fields
      contentTitle: "",
      contentDescription: "",
      contentUrl: "",
      contentType: "blog" as NewContentType,
      // Scheduling
      scheduleEnabled: false,
      scheduleDate: undefined as Date | undefined,
      scheduleHour: "09",
      scheduleMinute: "00",
    },
    validators: {
      onChange: ({ value }) => {
        const errors: Record<string, string> = {};

        if (!value.name.trim()) {
          errors.name = "Campaign name is required";
        }

        if (!value.subject.trim()) {
          errors.subject = "Subject is required";
        }

        if (value.emailType === EmailCampaignType.NEW_CONTENT) {
          if (!value.contentTitle.trim()) {
            errors.contentTitle = "Content title is required";
          }
          if (!value.contentDescription.trim()) {
            errors.contentDescription = "Content description is required";
          }
        }

        return Object.keys(errors).length > 0 ? errors : undefined;
      },
    },
    listeners: {
      onChange: ({ formApi }) => {
        const {
          emailType: currentEmailType,
          subject,
          htmlContent,
          contentTitle,
          contentDescription,
          contentUrl,
          contentType,
        } = formApi.state.values;

        renderPreviewMutation.mutate({
          emailType: currentEmailType,
          subject,
          htmlContent: htmlContent || undefined,
          contentTitle: contentTitle || undefined,
          contentDescription: contentDescription || undefined,
          contentUrl: contentUrl || undefined,
          contentType: contentType || undefined,
        });
      },
      onChangeDebounceMs: 300,
    },
    onSubmit: async ({ value }) => {
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

      await createCampaignMutation.mutateAsync({
        name: value.name,
        description: value.description || undefined,
        emailType: value.emailType,
        subject: value.subject,
        previewText: value.previewText || undefined,
        htmlContent: value.htmlContent || undefined,
        contentTitle: value.contentTitle || undefined,
        contentDescription: value.contentDescription || undefined,
        contentUrl: value.contentUrl || undefined,
        contentType: value.contentType || undefined,
        scheduledAt,
      });
    },
  });

  const emailType = useStore(form.store, (s) => s.values.emailType);
  const scheduleEnabled = useStore(form.store, (s) => s.values.scheduleEnabled);

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4"
          )}
          to="/marketing/email"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Email Marketing
        </Link>
        <h2 className="font-bold text-2xl tracking-tight">
          Create Email Campaign
        </h2>
        <p className="text-muted-foreground">
          Set up your email campaign content and scheduling
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
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <form.AppField name="name">
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel>Campaign Name *</field.FormLabel>
                      <Input
                        id={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Summer Newsletter 2024"
                        value={field.state.value}
                      />
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                </form.AppField>

                <form.AppField name="emailType">
                  {(field) => (
                    <field.FormItem>
                      <field.FormLabel>Email Template</field.FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.handleChange(value as EmailCampaignType)
                        }
                        value={field.state.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EmailCampaignType.NEWSLETTER}>
                            Newsletter
                          </SelectItem>
                          <SelectItem value={EmailCampaignType.NEW_CONTENT}>
                            New Content Announcement
                          </SelectItem>
                          <SelectItem value={EmailCampaignType.CUSTOM}>
                            Custom HTML
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                </form.AppField>
              </div>

              <form.AppField name="description">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Description</field.FormLabel>
                    <Textarea
                      className="min-h-[80px] resize-none"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe what this campaign is about..."
                      value={field.state.value}
                    />
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </CardContent>
          </Card>

          {/* Email Content */}
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <form.AppField name="subject">
                    {(field) => (
                      <field.FormItem>
                        <field.FormLabel>Subject Line *</field.FormLabel>
                        <Input
                          id={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Your email subject line"
                          value={field.state.value}
                        />
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  </form.AppField>

                  <form.AppField name="previewText">
                    {(field) => (
                      <field.FormItem>
                        <field.FormLabel>Preview Text</field.FormLabel>
                        <Input
                          id={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Preview text shown in email clients"
                          value={field.state.value}
                        />
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  </form.AppField>

                  {/* Newsletter Content */}
                  {emailType === EmailCampaignType.NEWSLETTER && (
                    <form.AppField name="htmlContent">
                      {(field) => (
                        <field.FormItem>
                          <field.FormLabel>Content (Markdown)</field.FormLabel>
                          <Textarea
                            className="min-h-[200px] font-mono text-sm"
                            id={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Write your newsletter content..."
                            value={field.state.value}
                          />
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    </form.AppField>
                  )}

                  {/* New Content Fields */}
                  {emailType === EmailCampaignType.NEW_CONTENT && (
                    <div className="space-y-4">
                      <form.AppField name="contentTitle">
                        {(field) => (
                          <field.FormItem>
                            <field.FormLabel>Content Title *</field.FormLabel>
                            <Input
                              id={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="My New Blog Post"
                              value={field.state.value}
                            />
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      </form.AppField>

                      <form.AppField name="contentDescription">
                        {(field) => (
                          <field.FormItem>
                            <field.FormLabel>Description *</field.FormLabel>
                            <Textarea
                              className="min-h-[100px]"
                              id={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="A brief description..."
                              value={field.state.value}
                            />
                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      </form.AppField>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <form.AppField name="contentUrl">
                          {(field) => (
                            <field.FormItem>
                              <field.FormLabel>Content URL</field.FormLabel>
                              <Input
                                id={field.name}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                placeholder="https://..."
                                value={field.state.value}
                              />
                              <field.FormMessage />
                            </field.FormItem>
                          )}
                        </form.AppField>

                        <form.AppField name="contentType">
                          {(field) => (
                            <field.FormItem>
                              <field.FormLabel>Content Type</field.FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.handleChange(value as NewContentType)
                                }
                                value={field.state.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="blog">
                                    Blog Post
                                  </SelectItem>
                                  <SelectItem value="project">
                                    Project
                                  </SelectItem>
                                  <SelectItem value="snippet">
                                    Snippet
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <field.FormMessage />
                            </field.FormItem>
                          )}
                        </form.AppField>
                      </div>
                    </div>
                  )}

                  {/* Custom HTML */}
                  {emailType === EmailCampaignType.CUSTOM && (
                    <form.AppField name="htmlContent">
                      {(field) => (
                        <field.FormItem>
                          <field.FormLabel>HTML Content</field.FormLabel>
                          <Textarea
                            className="min-h-[200px] font-mono text-sm"
                            id={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="<h1>Your HTML...</h1>"
                            value={field.state.value}
                          />
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    </form.AppField>
                  )}
                </div>

                {/* Email Preview */}
                <div className="space-y-2">
                  <Label className="font-medium text-sm">Live Preview</Label>
                  <div className="h-[500px] overflow-hidden rounded-lg border bg-white">
                    <ClientOnly
                      fallback={
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          Loading preview...
                        </div>
                      }
                    >
                      <EmailPreviewContent
                        isRendering={isRenderingPreview}
                        previewHtml={previewHtml}
                      />
                    </ClientOnly>
                  </div>
                </div>
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
                              ? "Campaign will be sent at the scheduled time"
                              : "Campaign will be saved as a draft"}
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
            <Link to="/marketing/email">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button disabled={createCampaignMutation.isPending} type="submit">
              <Send className="mr-2 h-4 w-4" />
              {getSubmitButtonText(
                createCampaignMutation.isPending,
                scheduleEnabled
              )}
            </Button>
          </div>
        </form>
      </form.AppForm>
    </>
  );
}
