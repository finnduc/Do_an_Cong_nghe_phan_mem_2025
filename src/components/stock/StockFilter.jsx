// StockFilter.js
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import DualRangeSlider from "../ui/slider";

export default function StockFilter({
  manufacturerFilter,
  setManufacturerFilter,
  categoryFilter,
  setCategoryFilter,
  priceExportRange,
  setPriceExportRange,
  priceImportRange,
  setPriceImportRange,
  quantityRange,
  setQuantityRange,
  applyFilters,
  resetFilters,
  manufacturers,
  categories,
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select onValueChange={setCategoryFilter} value={categoryFilter}>
          <SelectTrigger className='max-w-[135px]'>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.category_id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setManufacturerFilter} value={manufacturerFilter}>
          <SelectTrigger className='max-w-[135px]'>
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            {manufacturers.map((man) => (
              <SelectItem key={man.manufacturer_id} value={man.name}>
                {man.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-gray-600">
        <div>Quantity range:</div>
        <DualRangeSlider value={quantityRange} onValueChange={setQuantityRange} max={1000}/>
      </div>
      <div className="text-sm text-gray-600">
        <div>Export price range:</div>
        <DualRangeSlider value={priceExportRange} onValueChange={setPriceExportRange} />
      </div>
      <div className="text-sm text-gray-600">
        <div>Import price range:</div>
        <DualRangeSlider value={priceImportRange} onValueChange={setPriceImportRange} />
      </div>
      <div className="flex flex-col gap-2">
        <Button className="text-white bg-blue-500 hover:bg-blue-700" onClick={applyFilters}>
          Apply
        </Button>
        <Button variant="ghost" className="border" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>
    </div>
  );
}