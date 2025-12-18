import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductSchema,
  type ProductInput,
  SchemasByType,
  type ProductType,
} from "./schemas";
import { TextInput, NumberInput, TextareaInput } from "./inputs";

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

const getFieldConfig = (
  key: string
): { label: string; Component: React.FC<any> } | null => {
  switch (key) {
    case "name":
      return { label: "商品名", Component: TextInput };
    case "price":
      return { label: "価格", Component: NumberInput };
    case "description":
      return { label: "説明", Component: TextareaInput };
    case "author":
      return { label: "著者名", Component: TextInput };
    case "brand":
      return { label: "ブランド", Component: TextInput };
    case "warrantyMonths":
      return { label: "保証（月）", Component: NumberInput };
    case "material":
      return { label: "素材", Component: TextInput };
    case "dimensions":
      return { label: "寸法", Component: TextInput };
    default:
      return null;
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
  const fieldKeys = useMemo(
    () =>
      Object.keys(schema.shape).filter(
        (key) => key !== "productType"
      ) as string[],
    [schema]
  );

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

      {fieldKeys.map((key) => {
        const config = getFieldConfig(key);
        if (!config) return null;
        const { label, Component } = config;

        const fieldSchema = schema.shape[key];
        const isRequired = !(fieldSchema as any).isOptional();

        return (
          <Component
            key={key}
            name={key as keyof ProductInput}
            label={label}
            register={register}
            errors={errors}
            required={isRequired}
          />
        );
      })}

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
