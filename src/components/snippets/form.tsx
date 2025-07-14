import { formOptions } from "@tanstack/react-form";
import { generateSlug } from "~/lib/utils";
import { FormButton } from "../form-button";
import CustomMDX from "../mdx/mdx";
import { Checkbox } from "../ui/checkbox";
import { withForm } from "../ui/form";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

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
            <field.FormItem>
              <field.FormLabel>Title</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Snippet Title"
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
                  placeholder="snippet-title"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-required="true"
                  aria-describedby="slug-desc"
                />
              </field.FormControl>
              <p id="slug-desc" className="text-muted-foreground text-xs">
                Used in the URL: /snippets/your-slug
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
                  placeholder="A brief description of your snippet"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="category">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Category</field.FormLabel>
              <field.FormControl>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="React"
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

        <form.AppField name="code">
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
                      placeholder="```javascript
const add = (a, b) => a + b;
```"
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
                  This snippet won't be visible to visitors
                </p>
              </div>
            </field.FormItem>
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
