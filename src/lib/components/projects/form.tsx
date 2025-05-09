import { formOptions, ValidationErrorMap } from "@tanstack/react-form";
import React, { useState } from "react";
import { STACKS } from "~/lib/constants/stack";
import { Project } from "~/lib/server/schema";
import { generateSlug } from "~/lib/utils";
import CustomMDX from "../mdx/mdx";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { withForm } from "../ui/form";
import Icon from "../ui/icon";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];

export const projectFormOpts = formOptions({
  defaultValues: {
    title: "",
    slug: "",
    description: "",
    content: "",
    githubUrl: "",
    demoUrl: "",
    thumbnail: "",
    isFeatured: false,
    isDraft: false,
    stacks: [] as string[],
  },
});

interface FormField {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
}

export const ProjectsForm = withForm({
  ...projectFormOpts,
  props: {
    project: undefined as typeof Project.$inferSelect | undefined,
  },
  render: function Render({ form, project }) {
    const [previewImage, setPreviewImage] = useState<string | null>(
      project?.imageUrl ?? null,
    );

    const handleFileChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      field: FormField,
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        field.setErrorMap({
          onChange: [
            {
              message: "Please upload a valid image (JPEG, PNG, GIF, WebP, AVIF)",
            },
          ],
        });
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        field.setErrorMap({
          onChange: [
            {
              message: "Image size must be less than 5MB",
            },
          ],
        });
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(",")[1];

          field.handleChange("");
          form.setFieldValue("thumbnail", base64Data);
          setPreviewImage(base64String);
        };
        reader.onerror = () => {
          field.setErrorMap({
            onChange: [
              {
                message: "Error reading file",
              },
            ],
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        field.setErrorMap({
          onChange: [
            {
              message: "Failed to process image",
            },
          ],
        });
      }
    };

    const handleRemoveImage = () => {
      setPreviewImage(null);
      form.setFieldValue("thumbnail", "");
    };

    return (
      <>
        <form.AppField
          name="title"
          listeners={{
            onChange: ({ value }) => {
              const slug = generateSlug(value);
              form.setFieldValue("slug", slug);
            },
          }}
        >
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Title</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Portfolio Project"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-required="true"
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="slug">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Slug</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="portfolio-project"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-required="true"
                  aria-describedby="slug-desc"
                />
              </field.FormControl>
              <p id="slug-desc" className="text-xs text-muted-foreground">
                Used in the URL: /projects/your-slug
              </p>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Description</field.FormLabel>
              <field.FormControl>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="A brief description of your project"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="content">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Content</field.FormLabel>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="mt-0">
                  <field.FormControl>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      placeholder="# Project Details
## Overview
A brief overview of your project.
## Features
- Feature 1
- Feature 2
## Implementation
Details about how you implemented the project."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-[300px]"
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <div className="min-h-[300px] rounded-md border border-input p-4 overflow-y-auto">
                    {field.state.value ? (
                      <CustomMDX source={field.state.value} />
                    ) : (
                      <div className="text-muted-foreground">Nothing to preview</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </field.FormItem>
          )}
        </form.AppField>
        <form.AppField name="thumbnail">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Image</field.FormLabel>
              <field.FormControl>
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="file"
                      accept={VALID_IMAGE_TYPES.join(",")}
                      onBlur={field.handleBlur}
                      onChange={(e) => handleFileChange(e, field as FormField)}
                      className="cursor-pointer"
                      aria-describedby="file-input-help"
                    />
                    <p id="file-input-help" className="text-xs text-muted-foreground">
                      Accepted formats: JPEG, PNG, GIF, WebP, AVIF. Max size: 5MB
                    </p>
                  </div>
                  {previewImage && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="relative h-32 w-full max-w-md overflow-hidden rounded-md border border-input">
                        <img
                          src={previewImage}
                          alt="Project preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>
        <form.AppField name="githubUrl">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>GitHub URL</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="https://github.com/example"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="githubUrl">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>GitHub URL</field.FormLabel>
                <field.FormControl>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>

          <form.AppField name="demoUrl">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Demo URL</field.FormLabel>
                <field.FormControl>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    placeholder="https://example.com"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
        </div>

        <form.AppField name="stacks">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Stacks</field.FormLabel>
              <field.FormControl>
                <MultiSelect
                  options={Object.entries(STACKS).map(([key, value]) => ({
                    label: key,
                    value: key,
                    icon: <Icon icon={value} className="h-4 w-4" />,
                  }))}
                  onValueChange={(value) => field.handleChange(value)}
                  defaultValue={field.state.value}
                  placeholder="Select technology stacks"
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="isFeatured">
            {(field) => (
              <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <field.FormControl>
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onCheckedChange={(checked: boolean) => field.handleChange(checked)}
                  />
                </field.FormControl>
                <div className="space-y-1 leading-none">
                  <field.FormLabel>Featured Project</field.FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Display this project in featured section
                  </p>
                </div>
              </field.FormItem>
            )}
          </form.AppField>

          <form.AppField name="isDraft">
            {(field) => (
              <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <field.FormControl>
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onCheckedChange={(checked: boolean) => field.handleChange(checked)}
                  />
                </field.FormControl>
                <div className="space-y-1 leading-none">
                  <field.FormLabel>Save as Draft</field.FormLabel>
                  <p className="text-sm text-muted-foreground">
                    This project won't be visible to visitors
                  </p>
                </div>
              </field.FormItem>
            )}
          </form.AppField>
        </div>

        <form.Subscribe
          selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
        >
          {([canSubmit, isPending, isSubmitting]) => (
            <Button
              type="submit"
              variant="default"
              disabled={!canSubmit || isPending || isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Submitting..." : isPending ? "Processing..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </>
    );
  },
});
