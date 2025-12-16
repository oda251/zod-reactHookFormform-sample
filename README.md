## 商品出品フォーム 動的レンダリング機能 仕様書

### 1. 概要

本機能は、商品の種類に応じて入力項目が動的に変化する出品フォームを、Zod スキーマに一元化された定義に基づいてレンダリング・制御するための設計仕様である。

| 項目         | 詳細                                                                                                                                                   |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **設計思想** | Single Source of Truth (SSOT) - Zod スキーマをデータの構造、バリデーションルール、フォームの表示メタデータ（ラベル、入力タイプ）の唯一の定義元とする。 |
| **動的制御** | ユーザーが選択した `productType` に基づき、対応する Zod スキーマを解析し、フィールドを動的にレンダリングする。                                         |
| **型安全性** | Zod の `z.discriminatedUnion` により、フォームの入力値および送信データは型レベルで保証される。                                                         |

### 2. 使用ライブラリ

| ライブラリ名                | 用途                                                                               |
| :-------------------------- | :--------------------------------------------------------------------------------- |
| **zod**                     | スキーマ定義、バリデーションルール、およびフォームメタデータの格納。               |
| **react-hook-form**         | フォームの状態管理、入力フィールドの登録 (`register`)、送信処理 (`handleSubmit`)。 |
| **@hookform/resolvers/zod** | RHF と Zod の統合。フォーム全体のバリデーション実行。                              |

### 3. サンプルコード（主要構成要素）

#### 3-1. Zod スキーマ（`schemas.ts`）

```typescript
import { z } from "zod";

// フォーム表示メタデータの定義
export interface FieldMeta {
  label: string;
  inputType: "text" | "number" | "textarea" | "select";
}

// BookProduct スキーマの例
const BookSchema = z.object({
  productType: z.literal("BOOK"),
  name: z
    .string()
    .min(1)
    .meta({ label: "商品名", inputType: "text" } as FieldMeta),
  author: z
    .string()
    .min(1)
    .meta({ label: "著者名", inputType: "text" } as FieldMeta),
  // ... 他のフィールド
});

// Union型スキーマ（discriminator: productType）
export const ProductSchema = z.discriminatedUnion("productType", [
  BookSchema,
  // ... ElectronicsSchema, ClothingSchema
]);

export type ProductInput = z.infer<typeof ProductSchema>;
```

#### 3-2. スキーマ解析関数（utils.ts）

```typescript
// Zodスキーマからレンダリング設定を抽出するユーティリティ関数
function extractFormConfig(schema: z.AnyZodObject): FieldConfigWithKey[] {
  // 構造解析ロジック（Zodの .shape と .meta() を利用）をここに実装
  // key: 'name', label: '商品名', inputType: 'text' の形式の配列を返す
  /* ... 実装詳細省略 ... */
  return []; 
}
```

#### 3-3. 動的フォームコンポーネント（DynamicProductForm.tsx）

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, ProductInput } from './schemas';
import { getFormConfigByType } from './utils'; // 3-2で定義した関数

const DynamicProductForm = ({ initialProductType }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductInput>({
        resolver: zodResolver(ProductSchema),
        defaultValues: { productType: initialProductType },
    });

    const config = getFormConfigByType(initialProductType);

    const onSubmit = (data: ProductInput) => {
        // バリデーション済みの型安全なデータ
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('productType')} value={initialProductType} />
            
            {config.map(field => (
                <div key={field.key}>
                    <label>{field.label}</label>
                    <input 
                        type={field.inputType} 
                        {...register(field.key, { valueAsNumber: field.inputType === 'number' })} 
                    />
                    {errors[field.key]?.message && <span>{errors[field.key]?.message}</span>}
                </div>
            ))}
            
            <button type="submit">出品</button>
        </form>
    );
};
```