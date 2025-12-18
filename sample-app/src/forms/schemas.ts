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

export const ProductTypes = ["BOOK", "ELECTRONICS"] as const;
export type ProductType = (typeof ProductTypes)[number];

export type ZodObj = z.ZodObject<z.ZodRawShape>;
export const SchemasByType: Record<ProductType, ZodObj> = {
  BOOK: BookSchema,
  ELECTRONICS: ElectronicsSchema,
};
