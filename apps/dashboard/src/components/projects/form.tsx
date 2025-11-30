import { ProjectType } from "@acme/types";
import { withForm } from "@acme/ui/form";
import Icon from "@acme/ui/icon";
import { generateSlug } from "@acme/utils";
import { formOptions, ValidationErrorMap } from "@tanstack/react-form";
import { STACKS } from "~/lib/constants/stack";
import {
  FormCheckbox,
  FormImageUpload,
  FormInput,
  FormMDXEditor,
  FormMultiSelect,
  FormSlug,
  FormSubmitButton,
  FormTextarea,
} from "../form";

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

type FormField = {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
  handleBlur: () => void;
};

export const ProjectsForm = withForm({
  ...projectFormOpts,
  props: {
    project: undefined as ProjectType | undefined,
  },
  render({ form, project }) {
    return (
      <>
        <form.AppField
          listeners={{
            onChange: ({ value }) => {
              const slug = generateSlug(value);
              form.setFieldValue("slug", slug);
            },
          }}
          name="title"
        >
          {(field) => (
            <FormInput
              field={field}
              label="Title"
              placeholder="Portfolio Project"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="slug">
          {(field) => (
            <FormSlug
              field={field}
              label="Slug"
              placeholder="portfolio-project"
              urlPath="/projects/your-slug"
            />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <FormTextarea
              field={field}
              label="Description"
              placeholder="A brief description of your project"
            />
          )}
        </form.AppField>

        <form.AppField name="content">
          {(field) => (
            <FormMDXEditor
              field={field}
              label="Content"
              placeholder="# Project Details
## Overview
A brief overview of your project.
## Features
- Feature 1
- Feature 2
## Implementation
Details about how you implemented the project."
            />
          )}
        </form.AppField>

        <form.AppField name="thumbnail">
          {(field) => (
            <FormImageUpload
              field={field as FormField}
              initialPreview={project?.imageUrl}
              label="Image"
              name={field.name}
            />
          )}
        </form.AppField>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="githubUrl">
            {(field) => (
              <FormInput
                field={field}
                label="GitHub URL"
                placeholder="https://github.com/username/project"
                type="url"
              />
            )}
          </form.AppField>

          <form.AppField name="demoUrl">
            {(field) => (
              <FormInput
                field={field}
                label="Demo URL"
                placeholder="https://example.com"
                type="url"
              />
            )}
          </form.AppField>
        </div>

        <form.AppField name="stacks">
          {(field) => (
            <FormMultiSelect
              field={field}
              label="Stacks"
              options={Object.entries(STACKS).map(([key, value]) => ({
                label: key,
                value: key,
                icon: <Icon className="h-4 w-4" icon={value} />,
              }))}
              placeholder="Select technology stacks"
            />
          )}
        </form.AppField>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="isFeatured">
            {(field) => (
              <FormCheckbox
                description="Display this project in featured section"
                field={field}
                label="Featured Project"
              />
            )}
          </form.AppField>

          <form.AppField name="isDraft">
            {(field) => (
              <FormCheckbox
                description="This project won't be visible to visitors"
                field={field}
                label="Save as Draft"
              />
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
              <FormSubmitButton
                canSubmit={canSubmit ?? false}
                isPending={isPending ?? false}
                isSubmitting={isSubmitting ?? false}
              />
            )}
          </form.Subscribe>
        </div>
      </>
    );
  },
});
