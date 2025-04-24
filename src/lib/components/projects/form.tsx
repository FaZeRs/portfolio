import { formOptions } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";

import { CreateProjectSchema, Project, UpdateProjectSchema } from "~/lib/server/schema";
import { generateSlug } from "~/lib/utils";
import CustomMDX from "../mdx/mdx";
import { FormMessage, useAppForm } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type ProjectFormData =
  | z.infer<typeof CreateProjectSchema>
  | z.infer<typeof UpdateProjectSchema>;

export function ProjectsForm<T extends ProjectFormData>({
  project,
  handleSubmit,
  isSubmitting = false,
}: {
  project?: typeof Project.$inferSelect;
  handleSubmit: (data: T) => void;
  isSubmitting?: boolean;
}) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const formOpts = formOptions({
    defaultValues: {
      id: project?.id ?? "",
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      description: project?.description ?? "",
      content: project?.content ?? "",
      imageUrl: project?.imageUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      demoUrl: project?.demoUrl ?? "",
      thumbnail: "",
      isFeatured: project?.isFeatured ?? false,
    },
  });

  const form = useAppForm({
    ...formOpts,
    onSubmit: ({ formApi, value }) => {
      handleSubmit(value as T);
      formApi.reset();
      setUploadedImage(null);
    },
  });

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
      setUploadedImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
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
          <div className="space-y-2">
            <form.Label htmlFor="title">Title</form.Label>
            <field.Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="Portfolio Project"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FormMessage />
          </div>
        )}
      </form.AppField>
      <form.AppField name="slug">
        {(field) => (
          <div className="space-y-2">
            <form.Label htmlFor={field.name}>Slug</form.Label>
            <field.Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="portfolio-project"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FormMessage />
          </div>
        )}
      </form.AppField>
      <form.AppField name="description">
        {(field) => (
          <div className="space-y-2">
            <form.Label htmlFor={field.name}>Description</form.Label>
            <field.Textarea
              id={field.name}
              name={field.name}
              placeholder="A brief description of your project"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FormMessage />
          </div>
        )}
      </form.AppField>
      <form.AppField name="content">
        {(field) => (
          <div className="space-y-2">
            <form.Label htmlFor={field.name}>Content</form.Label>
            <Tabs defaultValue="write" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-0">
                <field.Textarea
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
            <FormMessage />
          </div>
        )}
      </form.AppField>
      <form.AppField name="imageUrl">
        {(field) => (
          <div className="space-y-2">
            <form.Label htmlFor={field.name}>Image</form.Label>
            <field.Input
              id={field.name}
              name={field.name}
              type="file"
              accept="image/*"
              onBlur={field.handleBlur}
              onChange={(e) => handleFileChange(e, field)}
            />
            {uploadedImage && (
              <div className="mt-2">
                <img
                  src={uploadedImage}
                  alt="Project preview"
                  className="max-h-32 rounded-md"
                />
              </div>
            )}
            {!uploadedImage && project?.imageUrl && (
              <div className="mt-2">
                <img
                  src={project.imageUrl}
                  alt="Current project image"
                  className="max-h-32 rounded-md"
                />
              </div>
            )}
            <FormMessage />
          </div>
        )}
      </form.AppField>
      <form.AppField name="githubUrl">
        {(field) => (
          <div className="space-y-2">
            <form.Label htmlFor={field.name}>GitHub URL</form.Label>
            <field.Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="https://github.com/example"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FormMessage />
          </div>
        )}
      </form.AppField>
      <form.AppField name="demoUrl">
        {(field) => (
          <div className="space-y-2">
            <form.Label htmlFor={field.name}>Demo URL</form.Label>
            <field.Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="https://example.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FormMessage />
          </div>
        )}
      </form.AppField>

      <form.AppField name="isFeatured">
        {(field) => (
          <div className="space-y-2">
            <form.Label htmlFor={field.name}>Featured</form.Label>
            <field.Checkbox
              id={field.name}
              name={field.name}
              checked={field.state.value}
              onBlur={field.handleBlur}
              onCheckedChange={(checked: boolean) => field.handleChange(checked)}
            />
            <FormMessage />
          </div>
        )}
      </form.AppField>

      <form.Subscribe selector={(formState) => [formState.canSubmit]}>
        {([canSubmit, isPending]) => (
          <form.Button
            type="submit"
            variant="default"
            disabled={!canSubmit || isPending || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : isPending ? "Processing..." : "Submit"}
          </form.Button>
        )}
      </form.Subscribe>
    </form>
  );
}
