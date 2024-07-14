import { InputHTMLAttributes } from "react";
import { UseFormReturn } from "react-hook-form";
import clsx from "clsx";

import { FormValues } from "../../types/Form";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: keyof FormValues;
  label: string;
  hooks: {
    register: UseFormReturn<FormValues>["register"];
    errors: UseFormReturn<FormValues>["formState"]["errors"];
  };
  bottomLabel?: React.ReactNode;
  regex?: { value: RegExp; message: string };
}

export default function FormInput({
  id,
  required,
  regex,
  bottomLabel,
  ...props
}: FormInputProps) {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">
          {props.label}
          <span className="text-red-600">*</span>
        </span>
        <span className="label-text-alt mt-auto">
          {props.hooks.errors[id] && (
            <span className="text-red-500">
              {props.hooks.errors[id].message}
            </span>
          )}
        </span>
      </div>

      <input
        id={id}
        {...props}
        {...props.hooks.register(id, {
          required: "Required",
          ...(regex ? { pattern: { ...regex } } : {}),
        })}
        className={clsx(
          "input input-bordered",
          "w-full outline-none",
          "focus:input-primary focus:!outline-none",
          "duration-300",
          props.className
        )}
      />

      {bottomLabel && (
        <div className="label">
          <div className="label-text" />
          <div className="label-text-alt">{bottomLabel}</div>
        </div>
      )}
    </label>
  );
}
