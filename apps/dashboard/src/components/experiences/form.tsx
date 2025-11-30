import { ExperienceType as ExperienceTypeEnum } from "@acme/db/schema";
import { ExperienceType } from "@acme/types";
import { withForm } from "@acme/ui/form";
import { formOptions, ValidationErrorMap } from "@tanstack/react-form";
import {
  FormCheckbox,
  FormDatePicker,
  FormImageUpload,
  FormInput,
  FormSelect,
  FormSubmitButton,
  FormTextarea,
} from "../form";

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

type FormField = {
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
  handleBlur: () => void;
};

export const ExperiencesForm = withForm({
  ...experienceFormOpts,
  props: {
    experience: undefined as ExperienceType | undefined,
  },
  render({ form, experience }) {
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
              placeholder="https://www.google.com"
              type="url"
            />
          )}
        </form.AppField>

        <form.AppField name="thumbnail">
          {(field) => (
            <FormImageUpload
              field={field as FormField}
              initialPreview={experience?.imageUrl}
              label="Image"
              name={field.name}
            />
          )}
        </form.AppField>

        <form.AppField name="type">
          {(field) => (
            <FormSelect
              field={field}
              label="Type"
              options={Object.values(ExperienceTypeEnum).map((type) => ({
                value: type,
                label: type,
              }))}
              placeholder="Select a type"
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
                disabled={form.getFieldValue("isOnGoing")}
                field={field}
                label="End Date"
                placeholder="Pick an end date"
              />
            )}
          </form.AppField>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="isOnGoing">
            {(field) => (
              <FormCheckbox
                className=""
                description="This experience is currently ongoing"
                field={field}
                label="On Going"
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
