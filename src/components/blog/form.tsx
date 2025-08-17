import { formOptions, ValidationErrorMap } from "@tanstack/react-form";
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

type FormField = {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
  handleBlur: () => void;
};

export const ArticleForm = withForm({
  ...articleFormOpts,
  props: {
    article: undefined as ArticleType | undefined,
  },
  render({ form, article }) {
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
              initialPreview={article?.imageUrl}
              label="Image"
              name={field.name}
            />
          )}
        </form.AppField>

        <form.AppField name="tags">
          {(field) => (
            <FormMultiSelect
              field={field}
              label="Tags"
              options={Object.entries(STACKS).map(([key, value]) => ({
                label: key,
                value: key,
                icon: <Icon className="h-4 w-4" icon={value} />,
              }))}
              placeholder="Select tags"
            />
          )}
        </form.AppField>

        <form.AppField name="isDraft">
          {(field) => (
            <FormCheckbox
              description="This article won't be visible to visitors"
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
                canSubmit={canSubmit}
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
