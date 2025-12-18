import { z } from "zod";
import * as Base from "../gen/schemas";

const BaseBook = Base.postBooksUpsertBody;
const BaseElectronics = Base.postElectronicsUpsertBody;

export const BookSchema = BaseBook;
export const ElectronicsSchema = BaseElectronics;

export const ProductSchema = z.discriminatedUnion("productType", [
  BookSchema,
  ElectronicsSchema,
]);

export type ProductInput = z.infer<typeof ProductSchema>;
export type ProductType = ProductInput["productType"];

export const ProductTypes = ProductSchema.options.map((option) => {
  const field = option.shape.productType;
  if (field instanceof z.ZodEnum) {
    return field.options[0];
  }
  throw new Error("productType must be a ZodEnum");
}) as [ProductType, ...ProductType[]];

export type ZodObj = z.ZodObject<z.ZodRawShape>;

export const SchemasByType: Record<ProductType, ZodObj> =
  ProductSchema.options.reduce((acc, option) => {
    const field = option.shape.productType;
    if (field instanceof z.ZodEnum) {
      const type = field.options[0] as ProductType;
      acc[type] = option as ZodObj;
    }
    return acc;
  }, {} as Record<ProductType, ZodObj>);
