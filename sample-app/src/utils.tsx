import { z } from "zod";
import type { FieldMeta, ProductInput, ZodObj } from "./schemas";

export type FieldConfig = {
  key: Exclude<keyof ProductInput, "productType">;
  label: string;
  inputType: FieldMeta["inputType"];
  required: boolean;
};

function hasDef(t: z.ZodTypeAny): t is z.ZodTypeAny & { def: unknown } {
  return typeof t === "object" && t !== null && "def" in t;
}

function hasMeta(obj: unknown): obj is { meta: unknown } {
  return typeof obj === "object" && obj !== null && "meta" in obj;
}

function isRecordStringUnknown(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isOptionalLike(t: z.ZodTypeAny): boolean {
  return (
    t instanceof z.ZodOptional ||
    t instanceof z.ZodNullable ||
    t instanceof z.ZodDefault
  );
}

function getMetaFromZodType(t: z.ZodTypeAny): FieldMeta | undefined {
  if (!hasDef(t)) return undefined;

  const defObj = t.def;
  if (!hasMeta(defObj)) return undefined;

  const metaCandidate = defObj.meta;
  if (!isRecordStringUnknown(metaCandidate)) return undefined;

  const label =
    typeof metaCandidate.label === "string" ? metaCandidate.label : undefined;

  const inputTypeCandidate = metaCandidate.inputType;
  let inputType: FieldMeta["inputType"] | undefined;
  if (
    inputTypeCandidate === "text" ||
    inputTypeCandidate === "number" ||
    inputTypeCandidate === "textarea" ||
    inputTypeCandidate === "select"
  ) {
    inputType = inputTypeCandidate;
  }

  if (label && inputType) return { label, inputType };
  return undefined;
}

export function extractFormConfig(schema: ZodObj): FieldConfig[] {
  const shape = schema.shape;
  const keys = Object.keys(shape) as Array<keyof typeof shape>;

  return keys
    .filter((key): key is FieldConfig["key"] => key !== "productType")
    .map((key) => {
      const def = shape[key] as z.ZodTypeAny;
      const meta = getMetaFromZodType(def);
      const label = meta?.label ?? key;
      const inputType = meta?.inputType ?? "text";
      const required = !isOptionalLike(def);
      return { key, label, inputType, required };
    });
}

export function getFormConfigByType(schema: ZodObj) {
  return extractFormConfig(schema);
}
