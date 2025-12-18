import { z } from "zod";
import type { ProductInput, ZodObj } from "./schemas";

export type InputType = "text" | "number" | "textarea" | "select";

export type FieldConfig = {
  key: Exclude<keyof ProductInput, "productType">;
  label: string;
  inputType: InputType;
  required: boolean;
};

const FIELD_INFO: Record<string, { label: string; inputType: InputType }> = {
  name: { label: "商品名", inputType: "text" },
  price: { label: "価格", inputType: "number" },
  description: { label: "説明", inputType: "textarea" },
  author: { label: "著者名", inputType: "text" },
  brand: { label: "ブランド", inputType: "text" },
  warrantyMonths: { label: "保証（月）", inputType: "number" },
};

function isOptionalLike(t: z.ZodTypeAny): boolean {
  return (
    t instanceof z.ZodOptional ||
    t instanceof z.ZodNullable ||
    t instanceof z.ZodDefault
  );
}

export function extractFormConfig(schema: ZodObj): FieldConfig[] {
  const shape = schema.shape;
  const keys = Object.keys(shape) as Array<keyof typeof shape>;

  return keys
    .filter((key): key is FieldConfig["key"] => key !== "productType")
    .map((key) => {
      const def = shape[key] as z.ZodTypeAny;
      const info = FIELD_INFO[key as string] || {
        label: key as string,
        inputType: "text",
      };
      const required = !isOptionalLike(def);
      return {
        key,
        label: info.label,
        inputType: info.inputType,
        required,
      };
    });
}

export function getFormConfigByType(schema: ZodObj) {
  return extractFormConfig(schema);
}
