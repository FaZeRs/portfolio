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
import { AIAssistDialog } from "./ai-assist-dialog";

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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Title
                  <span className="ml-1 text-destructive">*</span>
                </span>
                <AIAssistDialog
                  buttonSize="sm"
                  buttonVariant="ghost"
                  context={{
                    topic: form.getFieldValue("description") || "",
                    currentContent: form.getFieldValue("content") || "",
                  }}
                  description="Get AI-generated title suggestions for your blog post"
                  label="AI Suggest"
                  onApply={(content) => {
                    field.handleChange(content);
                  }}
                  type="title"
                />
              </div>
              <FormInput
                field={field}
                label=""
                placeholder="Article Title"
                required
              />
            </div>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description
                </span>
                <AIAssistDialog
                  buttonSize="sm"
                  buttonVariant="ghost"
                  context={{
                    title: form.getFieldValue("title") || "",
                    currentContent: form.getFieldValue("content") || "",
                  }}
                  description="Generate a compelling description for your blog post"
                  label="AI Suggest"
                  onApply={(content) => {
                    field.handleChange(content.trim());
                  }}
                  type="description"
                />
              </div>
              <FormTextarea
                field={field}
                label=""
                placeholder="A brief description of your article"
              />
            </div>
          )}
        </form.AppField>

        <form.AppField name="content">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Content
                </span>
                <div className="flex gap-2">
                  <AIAssistDialog
                    buttonSize="sm"
                    buttonVariant="ghost"
                    context={{
                      title: form.getFieldValue("title") || "",
                      description: form.getFieldValue("description") || "",
                    }}
                    description="Create a detailed outline for your blog post"
                    label="Create Outline"
                    onApply={(content) => {
                      field.handleChange(content.trim());
                    }}
                    type="outline"
                  />
                  <AIAssistDialog
                    buttonSize="sm"
                    buttonVariant="ghost"
                    context={{
                      title: form.getFieldValue("title") || "",
                      description: form.getFieldValue("description") || "",
                    }}
                    description="Generate complete blog post content"
                    label="Generate Content"
                    onApply={(content) => {
                      field.handleChange(content.trim());
                    }}
                    type="content"
                  />
                </div>
              </div>
              <FormMDXEditor
                field={field}
                label=""
                placeholder="# Article Details
## Overview
A brief overview of your article."
              />
            </div>
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
