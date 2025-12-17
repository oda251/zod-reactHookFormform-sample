import { z } from "zod";

export interface FieldMeta {
  label: string;
  inputType: "text" | "number" | "textarea" | "select";
  required?: boolean;
  [key: string]: unknown;
}

const commonFieldMeta: Record<"name" | "price" | "description", FieldMeta> = {
  name: { label: "商品名", inputType: "text", required: true },
  price: { label: "価格", inputType: "number", required: true },
  description: { label: "説明", inputType: "textarea" },
};

const bookFieldMeta: Record<
  "name" | "author" | "price" | "description",
  FieldMeta
> = {
  ...commonFieldMeta,
  author: { label: "著者名", inputType: "text", required: true },
};

const electronicsFieldMeta: Record<
  "name" | "brand" | "warrantyMonths" | "price" | "description",
  FieldMeta
> = {
  ...commonFieldMeta,
  brand: { label: "ブランド", inputType: "text", required: true },
  warrantyMonths: { label: "保証（月）", inputType: "number", required: true },
};

const CommonSchema = z.object({
  name: z.string().min(1).meta(commonFieldMeta.name),
  price: z.number().min(0).meta(commonFieldMeta.price),
  description: z.string().optional().meta(commonFieldMeta.description),
});

export const BookSchema = CommonSchema.extend({
  productType: z.literal("BOOK"),
  author: z.string().min(1).meta(bookFieldMeta.author),
});

export const ElectronicsSchema = CommonSchema.extend({
  productType: z.literal("ELECTRONICS"),
  brand: z.string().min(1).meta(electronicsFieldMeta.brand),
  warrantyMonths: z.number().min(0).meta(electronicsFieldMeta.warrantyMonths),
});

export const ProductSchema = z.discriminatedUnion("productType", [
  BookSchema,
  ElectronicsSchema,
]);

export type ProductInput = z.infer<typeof ProductSchema>;

export const ProductTypes = ["BOOK", "ELECTRONICS"] as const;
export type ProductType = (typeof ProductTypes)[number];

export type ZodObj = z.ZodObject<z.ZodRawShape>;
export const SchemasByType: Record<ProductType, ZodObj> = {
  BOOK: BookSchema,
  ELECTRONICS: ElectronicsSchema,
};
