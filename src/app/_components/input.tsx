import React, { type InputHTMLAttributes } from "react";
import { get } from "react-hook-form";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  errors?: Record<string, unknown>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      sizeClass = "px-4 py-3",
      fontClass = "font-body sm:text-sm sm:leading-6 ",
      rounded = "rounded-md",
      children,
      type = "text",
      errors,
      ...args
    },
    ref,
  ) => {
    const hasError = args.name ? get(errors, args.name) : false;
    const inputErrorClasses =
      "bg-red-50 ring-red-200 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-red-50";
    const inputClasses =
      "text-black dark:bg-gray-900 dark:text-white placeholder:text-gray-400 ring-slate-200 dark:ring-slate-600 focus:ring-indigo-500";

    return (
      <>
        <input
          ref={ref}
          type={type}
          className={`block w-full border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${
            hasError ? inputErrorClasses : inputClasses
          } ${rounded} ${fontClass} ${sizeClass} ${className}`}
          {...args}
        />
        {hasError && (
          <p className="mt-2 text-sm text-red-600">
            {errors[args.name].message}
          </p>
        )}
      </>
    );
  },
);

Input.displayName = "Input";

export default Input;
