import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const field = useFieldContext<string>();
  const body = field.state.meta.errors.length
    ? field.state.meta.errors.map((err) => err?.message).join(",")
    : children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Textarea,
    Checkbox,
  },
  formComponents: {
    Button,
    Label,
  },
  fieldContext,
  formContext,
});

export { FormMessage, useAppForm };
