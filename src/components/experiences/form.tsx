import { ValidationErrorMap, formOptions } from "@tanstack/react-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ExperienceType as ExperienceTypeEnum } from "~/lib/server/schema";
import { cn } from "~/lib/utils";
import { ExperienceType } from "~/types";
import { FormButton } from "../form-button";
import { ImageUpload } from "../image-upload";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { withForm } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

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
            <field.FormItem>
              <field.FormLabel>Title</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Software Engineer"
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

        <form.AppField name="institution">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Institution</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Google"
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

        <form.AppField name="url">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>URL</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="https://www.google.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              <field.FormMessage />
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
                  initialPreview={experience?.imageUrl}
                  onBlur={field.handleBlur}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="type">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Type</field.FormLabel>
              <field.FormControl>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as ExperienceTypeEnum)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(ExperienceTypeEnum).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="startDate">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Start Date</field.FormLabel>
                <field.FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.state.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon />
                        {field.state.value ? (
                          format(new Date(field.state.value), "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={
                          field.state.value
                            ? new Date(field.state.value)
                            : undefined
                        }
                        onSelect={(value) => {
                          if (value) {
                            field.handleChange(value.toISOString());
                          }
                        }}
                        initialFocus
                        fromYear={2010}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
          <form.AppField name="endDate">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>End Date</field.FormLabel>
                <field.FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.state.value && "text-muted-foreground",
                          form.getFieldValue("isOnGoing") &&
                            "cursor-not-allowed opacity-50",
                        )}
                        disabled={form.getFieldValue("isOnGoing")}
                      >
                        <CalendarIcon />
                        {field.state.value ? (
                          format(new Date(field.state.value), "PPP")
                        ) : (
                          <span>Pick an end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={
                          field.state.value
                            ? new Date(field.state.value)
                            : undefined
                        }
                        onSelect={(value) => {
                          if (value) {
                            field.handleChange(value.toISOString());
                          }
                        }}
                        initialFocus
                        fromYear={2010}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="isOnGoing">
            {(field) => (
              <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <field.FormControl>
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onCheckedChange={(checked: boolean) => {
                      field.handleChange(checked);
                      if (checked) {
                        form.setFieldValue("endDate", "");
                      }
                    }}
                  />
                </field.FormControl>
                <div className="space-y-1 leading-none">
                  <field.FormLabel>On Going</field.FormLabel>
                  <p className="text-muted-foreground text-sm">
                    This experience is currently ongoing
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
