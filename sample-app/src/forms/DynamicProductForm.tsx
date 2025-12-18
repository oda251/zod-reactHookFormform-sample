import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductSchema,
  type ProductInput,
  SchemasByType,
  type ProductType,
} from "../schemas";
import { getFormConfigByType } from "../utils";
import { TextInput, NumberInput, TextareaInput, SelectInput } from "./inputs";

type Props = {
  productType?: ProductType;
};

const getDefaultValuesForType = (type: ProductType): ProductInput => {
  const common = {
    name: "",
    price: 0,
    description: "",
  };

  switch (type) {
    case "BOOK":
      return {
        ...common,
        productType: "BOOK",
        author: "",
      };
    default:
      return {
        ...common,
        productType: "ELECTRONICS",
        brand: "",
        warrantyMonths: 0,
      };
  }
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

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType]);

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
          {(() => {
            switch (field.inputType) {
              case "text":
                return (
                  <TextInput
                    register={register}
                    errors={errors}
                    field={field}
                  />
                );
              case "number":
                return (
                  <NumberInput
                    register={register}
                    errors={errors}
                    field={field}
                  />
                );
              case "textarea":
                return (
                  <TextareaInput
                    register={register}
                    errors={errors}
                    field={field}
                  />
                );
              case "select":
                return (
                  <SelectInput
                    register={register}
                    errors={errors}
                    field={field}
                  />
                );
              default:
                return (
                  <TextInput
                    register={register}
                    errors={errors}
                    field={field}
                  />
                );
            }
          })()}
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
