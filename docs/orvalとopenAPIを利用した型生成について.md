# OpenAPI と Orval を利用した型生成について

## 概要

OpenAPI 仕様から TypeScript 型と Zod スキーマを自動生成するために、Orval を使用します。これにより、API ドキュメントとコードの同期を保ち、型安全性を確保できます。特に、型の継承のような概念を OpenAPI の`allOf`キーワードで実現可能です。

## OpenAPI での型の継承（allOf）

OpenAPI では、`allOf`を使って複数のスキーマを組み合わせ、継承のような構造を作成できます。これにより、共通のプロパティを共有しつつ、各サブタイプで独自のプロパティを追加できます。

### 例: 商品スキーマの定義（YAML）

```yaml
openapi: 3.0.0
info:
  title: Product API
  version: 1.0.0
components:
  schemas:
    CommonProduct:
      type: object
      properties:
        name:
          type: string
        price:
          type: number
      required:
        - name
        - price
    Book:
      allOf:
        - $ref: "#/components/schemas/CommonProduct"
        - type: object
          properties:
            productType:
              type: string
              enum: [BOOK]
            author:
              type: string
          required:
            - productType
            - author
    Electronics:
      allOf:
        - $ref: "#/components/schemas/CommonProduct"
        - type: object
          properties:
            productType:
              type: string
              enum: [ELECTRONICS]
            brand:
              type: string
            warrantyMonths:
              type: number
          required:
            - productType
            - brand
            - warrantyMonths
```

この例では、`CommonProduct`を基に`Book`と`Electronics`が継承しています。

## Orval の設定

Orval を使って上記の OpenAPI から TypeScript 型と Zod スキーマを生成します。設定ファイル（`orval.config.ts`）で Zod 生成を有効にします。

### orval.config.ts の例

```typescript
import { defineConfig } from "orval";

export default defineConfig({
  productApi: {
    input: {
      target: "./openapi.yaml", // OpenAPIファイルのパス
    },
    output: {
      mode: "tags-split",
      target: "./src/api", // 生成先ディレクトリ
      schemas: "./src/schemas", // Zodスキーマの出力パス
      client: "react-query", // クライアントタイプ（任意）
      override: {
        zod: {
          enabled: true, // Zodスキーマ生成を有効化
        },
      },
    },
  },
});
```

## 生成される Zod スキーマの例

Orval を実行すると、以下のような Zod スキーマが生成されます（`src/schemas/productApiSchemas.ts`など）。

```typescript
import { z } from "zod";

export const CommonProductSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export const BookSchema = CommonProductSchema.extend({
  productType: z.literal("BOOK"),
  author: z.string(),
});

export const ElectronicsSchema = CommonProductSchema.extend({
  productType: z.literal("ELECTRONICS"),
  brand: z.string(),
  warrantyMonths: z.number(),
});

export const ProductSchema = z.discriminatedUnion("productType", [
  BookSchema,
  ElectronicsSchema,
]);

export type ProductInput = z.infer<typeof ProductSchema>;
```

## 利点

- **型安全性の確保**: OpenAPI から自動生成されるため、API 変更時に型が同期されます。
- **継承の表現**: `allOf`で共通部分を再利用可能。
- **Zod との統合**: バリデーションスキーマとして直接使用可能。
- **メンテナンス性**: 手動での型定義を減らし、ドキュメントとコードの一貫性を保つ。
