import { z } from "zod";

export function isOptionalLike(t: z.ZodTypeAny): boolean {
  return (
    t instanceof z.ZodOptional ||
    t instanceof z.ZodNullable ||
    t instanceof z.ZodDefault
  );
}
