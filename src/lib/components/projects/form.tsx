import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

import { CreateProjectSchema } from "~/lib/server/schema";
import { generateSlug } from "~/lib/utils";
import CustomMDX from "../mdx/mdx";
import { FormMessage, useAppForm } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function ProjectsForm() {
  const formOpts = formOptions({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      imageUrl: "",
      githubUrl: "",
      demoUrl: "",
    } as z.infer<typeof CreateProjectSchema>,
  });

  const form = useAppForm({
    ...formOpts,
    validators: {
      onChange: CreateProjectSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      console.log(value);
      formApi.reset();
    },
  });

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
              placeholder="Select file"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
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

      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <form.Button type="submit" variant="default" disabled={!canSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </form.Button>
        )}
      </form.Subscribe>
    </form>
  );
}
