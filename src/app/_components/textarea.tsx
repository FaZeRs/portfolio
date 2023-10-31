import { ErrorMessage } from "@hookform/error-message";
import React, { type TextareaHTMLAttributes } from "react";
import { get } from "react-hook-form";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  errors?: Record<string, unknown>;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      sizeClass = "px-4 py-3",
      fontClass = "font-body sm:text-sm sm:leading-6",
      rounded = "rounded-md",
      children,
      rows = 10,
      errors,
      name,
      ...args
    },
    ref,
  ) => {
    const hasError = errors && name ? !!get(errors, name) : false;
    const inputErrorClasses =
      "bg-red-50 ring-red-200 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-red-50";
    const inputClasses =
      "text-black dark:bg-gray-900 dark:text-white placeholder:text-gray-400 ring-slate-200 dark:ring-slate-600 focus:ring-indigo-500";

    return (
      <>
        <textarea
          ref={ref}
          className={`block w-full border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${
            hasError ? inputErrorClasses : inputClasses
          } ${rounded} ${fontClass} ${sizeClass} ${className}`}
          rows={rows}
          aria-invalid={hasError ? "true" : "false"}
          {...args}
        >
          {children}
        </textarea>
        {hasError && name && (
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="mt-2 text-sm text-red-600">{message}</p>
            )}
          />
        )}
      </>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
