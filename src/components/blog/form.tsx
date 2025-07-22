import { ValidationErrorMap, formOptions } from "@tanstack/react-form";
import { STACKS } from "~/lib/constants/stack";
import { generateSlug } from "~/lib/utils";
import { ArticleType } from "~/types";
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
import { withForm } from "../ui/form";
import Icon from "../ui/icon";

export const articleFormOpts = formOptions({
  defaultValues: {
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    isDraft: false,
    tags: [] as string[],
  },
});

interface FormField {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
  handleBlur: () => void;
}

export const ArticleForm = withForm({
  ...articleFormOpts,
  props: {
    article: undefined as ArticleType | undefined,
  },
  render: function Render({ form, article }) {
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
            <FormInput
              field={field}
              label="Title"
              placeholder="Article Title"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="slug">
          {(field) => (
            <FormSlug
              field={field}
              label="Slug"
              placeholder="article-title"
              urlPath="/blog/your-slug"
            />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <FormTextarea
              field={field}
              label="Description"
              placeholder="A brief description of your article"
            />
          )}
        </form.AppField>

        <form.AppField name="content">
          {(field) => (
            <FormMDXEditor
              field={field}
              label="Content"
              placeholder="# Article Details
## Overview
A brief overview of your article."
            />
          )}
        </form.AppField>

        <form.AppField name="thumbnail">
          {(field) => (
            <FormImageUpload
              field={field as FormField}
              name={field.name}
              label="Image"
              initialPreview={article?.imageUrl}
            />
          )}
        </form.AppField>

        <form.AppField name="tags">
          {(field) => (
            <FormMultiSelect
              field={field}
              label="Tags"
              placeholder="Select tags"
              options={Object.entries(STACKS).map(([key, value]) => ({
                label: key,
                value: key,
                icon: <Icon icon={value} className="h-4 w-4" />,
              }))}
            />
          )}
        </form.AppField>

        <form.AppField name="isDraft">
          {(field) => (
            <FormCheckbox
              field={field}
              label="Save as Draft"
              description="This article won't be visible to visitors"
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
                canSubmit={true}
                isPending={isPending}
                isSubmitting={isSubmitting}
              />
            )}
          </form.Subscribe>
        </div>
      </>
    );
  },
});
