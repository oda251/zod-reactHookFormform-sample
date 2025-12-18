import React from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { ProductInput } from "../schemas";

type Props = {
  register: UseFormRegister<ProductInput>;
  errors: FieldErrors<ProductInput>;
  name: keyof ProductInput;
  label: string;
  options?: { label: string; value: string }[];
};

export const SelectInput: React.FC<Props> = ({
  register,
  errors,
  name,
  label,
  options = [],
}) => {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}</label>
      <select
        {...register(name)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">選択してください</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <div className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message ?? "")}
        </div>
      )}
    </div>
  );
};
