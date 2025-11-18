import { ClientOnly } from "@tanstack/react-router";
import { Suspense } from "react";
import CustomMDX from "../mdx/mdx";
import { Spinner } from "../ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

type FormMDXEditorProps = {
  field: {
    name: string;
    state: { value: string };
    handleBlur: () => void;
    handleChange: (value: string) => void;
  };
  label: string;
  placeholder: string;
  className?: string;
};

export function FormMDXEditor({
  field,
  label,
  placeholder,
  className,
}: Readonly<FormMDXEditorProps>) {
  return (
    <div className={className}>
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={field.name}
      >
        {label}
      </label>
      <Tabs className="w-full" defaultValue="write">
        <TabsList className="mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-0" value="write">
          <Textarea
            className="min-h-[300px]"
            id={field.name}
            name={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder={placeholder}
            value={field.state.value}
          />
        </TabsContent>
        <TabsContent className="mt-0" value="preview">
          <div className="min-h-[300px] overflow-y-auto rounded-md border border-input p-4">
            {field.state.value ? (
              <ClientOnly>
                <Suspense fallback={<Spinner className="size-6" />}>
                  <article className="prose prose-slate dark:prose-invert !max-w-none">
                    <CustomMDX source={field.state.value} />
                  </article>
                </Suspense>
              </ClientOnly>
            ) : (
              <div className="text-muted-foreground">Nothing to preview</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
