import React from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { ProductInput } from "../schemas";
import type { FieldConfig } from "../utils";

type Props = {
  register: UseFormRegister<ProductInput>;
  errors: FieldErrors<ProductInput>;
  field: FieldConfig;
};

export const NumberInput: React.FC<Props> = ({ register, errors, field }) => {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{field.label}</label>
      <input
        type="number"
        {...register(field.key, { valueAsNumber: true })}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {errors[field.key] && (
        <div className="text-red-500 text-sm mt-1">
          {String(errors[field.key]?.message ?? "")}
        </div>
      )}
    </div>
  );
};
