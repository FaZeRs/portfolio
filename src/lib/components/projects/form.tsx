import { formOptions } from "@tanstack/react-form";
import React, { useState } from "react";
import { Project } from "~/lib/server/schema";
import { generateSlug } from "~/lib/utils";
import CustomMDX from "../mdx/mdx";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { withForm } from "../ui/form";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

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
  },
});

export const ProjectsForm = withForm({
  ...projectFormOpts,
  props: {
    project: undefined as typeof Project.$inferSelect | undefined,
  },
  render: function Render({ form, project }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleFileChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: {
        handleChange: (value: string) => void;
      },
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];

        field.handleChange("");
        form.setFieldValue("thumbnail", base64Data);

        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
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
                />
              </field.FormControl>
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
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <div className="min-h-[300px] rounded-md border border-input p-4">
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
                <Input
                  id={field.name}
                  name={field.name}
                  type="file"
                  accept="image/*"
                  onBlur={field.handleBlur}
                  onChange={(e) => handleFileChange(e, field)}
                />
              </field.FormControl>
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Project preview"
                    className="max-h-32 rounded-md"
                  />
                </div>
              )}
              {!previewImage && project?.imageUrl && (
                <div className="mt-2">
                  <img
                    src={project.imageUrl}
                    alt="Current project image"
                    className="max-h-32 rounded-md"
                  />
                </div>
              )}
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
        <form.AppField name="demoUrl">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Demo URL</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="https://example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="isFeatured">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Featured</field.FormLabel>
              <field.FormControl>
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked: boolean) => field.handleChange(checked)}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="isDraft">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Draft</field.FormLabel>
              <field.FormControl>
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked: boolean) => field.handleChange(checked)}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.Subscribe
          selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
        >
          {([canSubmit, isPending, isSubmitting]) => (
            <Button
              type="submit"
              variant="default"
              disabled={!canSubmit || isPending || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : isPending ? "Processing..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </>
    );
  },
});
