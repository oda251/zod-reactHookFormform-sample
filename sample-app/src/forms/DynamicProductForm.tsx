import React, { useEffect, useMemo } from "react";
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ProductSchema,
  type ProductInput,
  SchemasByType,
  type ProductType,
} from "./schemas";
import { TextInput, NumberInput, TextareaInput } from "./inputs";
import { isOptionalLike } from "./utils";

type Props = {
  productType?: ProductType;
};

type BaseFieldProps = {
  name: keyof ProductInput;
  label: string;
  register: UseFormRegister<ProductInput>;
  errors: FieldErrors<ProductInput>;
  required?: boolean;
};

type FieldConfig = {
  label: string;
  render: (props: BaseFieldProps) => React.ReactNode;
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
): FieldConfig | null => {
  switch (key) {
    case "name":
      return {
        label: "商品名",
        render: (props) => <TextInput {...props} />,
      };
    case "price":
      return {
        label: "価格",
        render: (props) => <NumberInput {...props} />,
      };
    case "description":
      return {
        label: "説明",
        render: (props) => <TextareaInput {...props} />,
      };
    case "author":
      return {
        label: "著者名",
        render: (props) => <TextInput {...props} />,
      };
    case "brand":
      return {
        label: "ブランド",
        render: (props) => <TextInput {...props} />,
      };
    case "warrantyMonths":
      return {
        label: "保証（月）",
        render: (props) => <NumberInput {...props} />,
      };
    case "material":
      return {
        label: "素材",
        render: (props) => <TextInput {...props} />,
      };
    case "dimensions":
      return {
        label: "寸法",
        render: (props) => <TextInput {...props} />,
      };
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
      ) as (keyof ProductInput)[],
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
        const { label, render } = config;

        const fieldSchema = schema.shape[key] as z.ZodTypeAny;
        const isRequired = !isOptionalLike(fieldSchema);

        return (
          <React.Fragment key={key}>
            {render({
              name: key,
              label,
              register,
              errors,
              required: isRequired,
            })}
          </React.Fragment>
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
