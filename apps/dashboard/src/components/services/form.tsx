import { STACKS } from "@acme/shared/stack";
import { ServiceType } from "@acme/types";
import { withForm } from "@acme/ui/form";
import Icon from "@acme/ui/icon";
import { generateSlug } from "@acme/utils";
import { formOptions, ValidationErrorMap } from "@tanstack/react-form";
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

export const serviceFormOpts = formOptions({
  defaultValues: {
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    isDraft: false,
    stacks: [] as string[],
  },
});

interface FormField {
  handleBlur: () => void;
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
}

export const ServicesForm = withForm({
  ...serviceFormOpts,
  props: {
    service: undefined as ServiceType | undefined,
  },
  render({ form, service }) {
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
              placeholder="Portfolio Service"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="slug">
          {(field) => (
            <FormSlug
              field={field}
              label="Slug"
              placeholder="portfolio-service"
              urlPath="/services/your-slug"
            />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <FormTextarea
              field={field}
              label="Description"
              placeholder="A brief description of your service"
            />
          )}
        </form.AppField>

        <form.AppField name="content">
          {(field) => (
            <FormMDXEditor
              field={field}
              label="Content"
              placeholder="# Service Details
## Overview
A brief overview of your service.
## Features
- Feature 1
- Feature 2
## Details
Details about your service."
            />
          )}
        </form.AppField>

        <form.AppField name="thumbnail">
          {(field) => (
            <FormImageUpload
              field={field as FormField}
              initialPreview={service?.imageUrl}
              label="Image"
              name={field.name}
            />
          )}
        </form.AppField>

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

        <form.AppField name="isDraft">
          {(field) => (
            <FormCheckbox
              description="This service won't be visible to visitors"
              field={field}
              label="Save as Draft"
            />
          )}
        </form.AppField>

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
