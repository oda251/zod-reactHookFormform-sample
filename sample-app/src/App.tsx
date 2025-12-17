import { useState } from "react";
import DynamicProductForm from "./DynamicProductForm";
import { ProductTypes, type ProductType } from "./schemas";

function App() {
  const [type, setType] = useState<ProductType>("BOOK");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        商品出品フォーム（Zod + react-hook-form）
      </h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">商品タイプ: </label>
        <select
          title="商品タイプ選択"
          value={type}
          onChange={(e) => setType(e.target.value as ProductType)}
          className="p-2 border border-gray-300 rounded"
        >
          {ProductTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <DynamicProductForm productType={type} />
    </div>
  );
}

export default App;
