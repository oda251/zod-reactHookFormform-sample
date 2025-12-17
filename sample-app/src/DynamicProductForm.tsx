import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductSchema,
  type ProductInput,
  SchemasByType,
  type ProductType,
} from "./schemas";
import { getFormConfigByType } from "./utils";

type Props = {
  productType?: ProductType;
};

const getDefaultValuesForType = (type: ProductType): ProductInput => {
  if (type === "BOOK") {
    return {
      productType: "BOOK",
      name: "",
      author: "",
      price: 0,
      description: "",
    };
  }

  return {
    productType: "ELECTRONICS",
    name: "",
    brand: "",
    warrantyMonths: 0,
    price: 0,
    description: "",
  };
};

export const DynamicProductForm: React.FC<Props> = ({
  productType = "BOOK",
}) => {
  const defaultValues = useMemo(
    () => getDefaultValuesForType(productType),
    [productType]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const schema = SchemasByType[productType];
  const config = useMemo(() => getFormConfigByType(schema), [schema]);

  const onSubmit = (data: ProductInput) => {
    console.log("submit", data);
    alert("送信成功: " + JSON.stringify(data, null, 2));
    reset(defaultValues);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
    >
      <input type="hidden" {...register("productType")} />

      {config.map((field) => (
        <div key={field.key} className="mb-4">
          <label className="block font-semibold mb-1">{field.label}</label>
          {field.inputType === "textarea" ? (
            <textarea
              {...register(field.key)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <input
              type={field.inputType}
              {...register(field.key, {
                valueAsNumber: field.inputType === "number",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          {errors[field.key] && (
            <div className="text-red-500 text-sm mt-1">
              {String(errors[field.key]?.message ?? "")}
            </div>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        出品
      </button>
    </form>
  );
};

export default DynamicProductForm;
