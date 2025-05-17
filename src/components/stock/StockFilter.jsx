// StockFilter.js
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import DualRangeSlider from "../ui/slider";

export default function StockFilter({
  manufacturerFilter,
  setManufacturerFilter,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  quantityRange,
  setQuantityRange,
  priceTypeFilter,
  setPriceTypeFilter,
  applyFilters,
  resetFilters,
  manufacturers,
  categories,
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select onValueChange={setCategoryFilter} value={categoryFilter}>
          <SelectTrigger>
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
          <SelectTrigger>
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
        <DualRangeSlider value={quantityRange} onValueChange={setQuantityRange} />
      </div>
      <div className="text-sm text-gray-600">
        <div>Price range:</div>
        <DualRangeSlider value={priceRange} onValueChange={setPriceRange} />
      </div>
      <Select onValueChange={setPriceTypeFilter} value={priceTypeFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Price type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="import">import price</SelectItem>
          <SelectItem value="export">export price</SelectItem>
        </SelectContent>
      </Select>
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