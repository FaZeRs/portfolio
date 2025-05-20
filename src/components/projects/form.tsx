import { ValidationErrorMap, formOptions } from "@tanstack/react-form";
import { STACKS } from "~/lib/constants/stack";
import { generateSlug } from "~/lib/utils";
import { ProjectType } from "~/types";
import { FormButton } from "../form-button";
import { ImageUpload } from "../image-upload";
import CustomMDX from "../mdx/mdx";
import { Checkbox } from "../ui/checkbox";
import { withForm } from "../ui/form";
import Icon from "../ui/icon";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
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
    stacks: [] as string[],
  },
});

interface FormField {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
  handleBlur: () => void;
}

export const ProjectsForm = withForm({
  ...projectFormOpts,
  props: {
    project: undefined as ProjectType | undefined,
  },
  render: function Render({ form, project }) {
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
              <p id="slug-desc" className="text-muted-foreground text-xs">
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
                  <div className="min-h-[300px] overflow-y-auto rounded-md border border-input p-4">
                    {field.state.value ? (
                      <CustomMDX source={field.state.value} />
                    ) : (
                      <div className="text-muted-foreground">
                        Nothing to preview
                      </div>
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
                <ImageUpload
                  field={field as FormField}
                  name={field.name}
                  initialPreview={project?.imageUrl}
                  onBlur={field.handleBlur}
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
                    onCheckedChange={(checked: boolean) =>
                      field.handleChange(checked)
                    }
                  />
                </field.FormControl>
                <div className="space-y-1 leading-none">
                  <field.FormLabel>Featured Project</field.FormLabel>
                  <p className="text-muted-foreground text-sm">
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
                    onCheckedChange={(checked: boolean) =>
                      field.handleChange(checked)
                    }
                  />
                </field.FormControl>
                <div className="space-y-1 leading-none">
                  <field.FormLabel>Save as Draft</field.FormLabel>
                  <p className="text-muted-foreground text-sm">
                    This project won't be visible to visitors
                  </p>
                </div>
              </field.FormItem>
            )}
          </form.AppField>
        </div>

        <div>
          <form.Subscribe
            selector={(formState) => [
              formState.canSubmit,
              formState.isSubmitting,
            ]}
          >
            {([canSubmit, isPending, isSubmitting]) => (
              <FormButton
                canSubmit={canSubmit}
                isPending={isPending}
                isSubmitting={isSubmitting}
                defaultText="Submit"
                loadingText="Submitting..."
                processingText="Processing..."
                variant="default"
                className="w-full md:w-auto"
                size="default"
              />
            )}
          </form.Subscribe>
        </div>
      </>
    );
  },
});
