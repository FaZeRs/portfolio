import { Slot } from "@radix-ui/react-slot";
import { createFormHook, createFormHookContexts, useStore } from "@tanstack/react-form";
import { createContext, use, useId, useMemo } from "react";

import { cn } from "~/lib/utils";
import { Label } from "./label";

const {
  fieldContext,
  formContext,
  useFieldContext: _useFieldContext,
  useFormContext,
} = createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
  },
  formComponents: {},
});

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = useId();
  const contextValue = useMemo(() => ({ id }), [id]);

  return (
    <FormItemContext value={contextValue}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </FormItemContext>
  );
}

const useFieldContext = () => {
  const { id } = use(FormItemContext);
  const { name, store, ...fieldContext } = _useFieldContext();

  const errors = useStore(store, (state) => state.meta.errors);
  if (!fieldContext) {
    throw new Error("useFieldContext should be used within <FormItem>");
  }

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    errors,
    store,
    ...fieldContext,
  };
};

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { formItemId, errors } = useFieldContext();

  return (
    <Label
      data-slot="form-label"
      data-error={!!errors.length}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { errors, formItemId, formDescriptionId, formMessageId } = useFieldContext();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !errors.length ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!errors.length}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFieldContext();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { errors, formMessageId } = useFieldContext();
  const body = errors.length ? String(errors.at(0)?.message ?? "") : props.children;
  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export { useAppForm, useFieldContext, useFormContext, withForm };
