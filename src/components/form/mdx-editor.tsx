import CustomMDX from "../mdx/mdx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

interface FormMDXEditorProps {
  field: {
    name: string;
    state: { value: string };
    handleBlur: () => void;
    handleChange: (value: string) => void;
  };
  label: string;
  placeholder: string;
  className?: string;
}

export function FormMDXEditor({
  field,
  label,
  placeholder,
  className,
}: Readonly<FormMDXEditorProps>) {
  return (
    <div className={className}>
      <label
        htmlFor={field.name}
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-0">
          <Textarea
            id={field.name}
            name={field.name}
            placeholder={placeholder}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            className="min-h-[300px]"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[300px] overflow-y-auto rounded-md border border-input p-4">
            {field.state.value ? (
              <CustomMDX source={field.state.value} />
            ) : (
              <div className="text-muted-foreground">Nothing to preview</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
