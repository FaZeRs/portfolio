import { formOptions, ValidationErrorMap } from "@tanstack/react-form";
import { ExperienceType as ExperienceTypeEnum } from "~/lib/server/schema";
import { ExperienceType } from "~/types";
import {
  FormCheckbox,
  FormDatePicker,
  FormImageUpload,
  FormInput,
  FormSelect,
  FormSubmitButton,
  FormTextarea,
} from "../form";
import { withForm } from "../ui/form";

export const experienceFormOpts = formOptions({
  defaultValues: {
    title: "",
    institution: "",
    description: "",
    thumbnail: "",
    startDate: "",
    endDate: "",
    url: "",
    type: ExperienceTypeEnum.WORK,
    isDraft: false,
    isOnGoing: false,
  },
});

interface FormField {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
  handleBlur: () => void;
}

export const ExperiencesForm = withForm({
  ...experienceFormOpts,
  props: {
    experience: undefined as ExperienceType | undefined,
  },
  render: function Render({ form, experience }) {
    return (
      <>
        <form.AppField name="title">
          {(field) => (
            <FormInput
              field={field}
              label="Title"
              placeholder="Software Engineer"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="institution">
          {(field) => (
            <FormInput
              field={field}
              label="Institution"
              placeholder="Google"
              required
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

        <form.AppField name="url">
          {(field) => (
            <FormInput
              field={field}
              label="URL"
              type="url"
              placeholder="https://www.google.com"
            />
          )}
        </form.AppField>

        <form.AppField name="thumbnail">
          {(field) => (
            <FormImageUpload
              field={field as FormField}
              name={field.name}
              label="Image"
              initialPreview={experience?.imageUrl}
            />
          )}
        </form.AppField>

        <form.AppField name="type">
          {(field) => (
            <FormSelect
              field={field}
              label="Type"
              placeholder="Select a type"
              options={Object.values(ExperienceTypeEnum).map((type) => ({
                value: type,
                label: type,
              }))}
            />
          )}
        </form.AppField>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="startDate">
            {(field) => (
              <FormDatePicker
                field={field}
                label="Start Date"
                placeholder="Pick a start date"
              />
            )}
          </form.AppField>
          <form.AppField name="endDate">
            {(field) => (
              <FormDatePicker
                field={field}
                label="End Date"
                placeholder="Pick an end date"
                disabled={form.getFieldValue("isOnGoing")}
              />
            )}
          </form.AppField>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="isOnGoing">
            {(field) => (
              <FormCheckbox
                field={field}
                label="On Going"
                description="This experience is currently ongoing"
                className=""
              />
            )}
          </form.AppField>
          <form.AppField name="isDraft">
            {(field) => (
              <FormCheckbox
                field={field}
                label="Save as Draft"
                description="This project won't be visible to visitors"
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
