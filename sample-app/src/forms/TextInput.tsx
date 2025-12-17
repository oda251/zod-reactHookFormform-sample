import React from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { ProductInput } from "../schemas";
import type { FieldConfig } from "../utils";

type Props = {
  register: UseFormRegister<ProductInput>;
  errors: FieldErrors<ProductInput>;
  field: FieldConfig;
};

export const TextInput: React.FC<Props> = ({ register, errors, field }) => {
  return (
    <>
      <input
        type="text"
        {...register(field.key)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {errors[field.key] && (
        <div className="text-red-500 text-sm mt-1">
          {String(errors[field.key]?.message ?? "")}
        </div>
      )}
    </>
  );
};
