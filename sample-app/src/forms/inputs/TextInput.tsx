import React from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { ProductInput } from "../schemas";

type Props = {
  register: UseFormRegister<ProductInput>;
  errors: FieldErrors<ProductInput>;
  name: keyof ProductInput;
  label: string;
};

export const TextInput: React.FC<Props & { required?: boolean }> = ({
  register,
  errors,
  name,
  label,
  required,
}) => {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        {...register(name)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {errors[name] && (
        <div className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message ?? "")}
        </div>
      )}
    </div>
  );
};
