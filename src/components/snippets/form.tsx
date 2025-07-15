import { formOptions } from "@tanstack/react-form";
import { generateSlug } from "~/lib/utils";
import {
  FormCheckbox,
  FormInput,
  FormMDXEditor,
  FormSlug,
  FormSubmitButton,
  FormTextarea,
} from "../form";
import { withForm } from "../ui/form";

export const snippetFormOpts = formOptions({
  defaultValues: {
    title: "",
    slug: "",
    description: "",
    category: "",
    code: "",
    isDraft: false,
  },
});

export const SnippetsForm = withForm({
  ...snippetFormOpts,
  render: function Render({ form }) {
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
              placeholder="Snippet Title"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="slug">
          {(field) => (
            <FormSlug
              field={field}
              label="Slug"
              placeholder="snippet-title"
              urlPath="/snippets/your-slug"
            />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <FormTextarea
              field={field}
              label="Description"
              placeholder="A brief description of your snippet"
            />
          )}
        </form.AppField>

        <form.AppField name="category">
          {(field) => (
            <FormInput
              field={field}
              label="Category"
              placeholder="React"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="code">
          {(field) => (
            <FormMDXEditor
              field={field}
              label="Content"
              placeholder="```javascript
const add = (a, b) => a + b;
```"
            />
          )}
        </form.AppField>

        <form.AppField name="isDraft">
          {(field) => (
            <FormCheckbox
              field={field}
              label="Save as Draft"
              description="This snippet won't be visible to visitors"
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
