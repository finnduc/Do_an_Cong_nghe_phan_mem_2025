
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DualRangeSlider from "../ui/slider";
import TransactionFieldCombobox from "../stock/TransactionFieldCombobox";
import { formatDate } from "@/lib/utils";

export default function ImportFilter({
  employeeFilter,
  setEmployeeFilter,
  partnerFilter,
  setPartnerFilter,
  priceRange,
  setPriceRange,
  dateFilter,
  setDateFilter,
  applyFilters,
  resetFilters,
  employees,
  partners,
}) {

  const handleStartDateChange = (value) => {
    setDateFilter((prev) => ({ ...prev, startDate: value }));
  };

  const handleEndDateChange = (value) => {
    setDateFilter((prev) => ({ ...prev, endDate: value }));
  };

  return (
    <div className="space-y-4 w-full max-w-full pb-4">
      {/* Employee */}
      <div>
        <label className="block mb-1 font-normal text-sm">Employee</label>
        <TransactionFieldCombobox
          items={employees}
          valueField="employee_id"
          labelField="name"
          inputValue={employeeFilter}
          setInputValue={setEmployeeFilter}
          placeholder="Select employee"
          autoSubmitOnSelect={applyFilters}
        />
      </div>

      {/* Partner */}
      <div>
        <label className="block mb-1 font-normal text-sm">Partner</label>
        <TransactionFieldCombobox
          items={partners}
          valueField="partner_id"
          labelField="name"
          inputValue={partnerFilter}
          setInputValue={setPartnerFilter}
          placeholder="Select partner"
          autoSubmitOnSelect={applyFilters}
        />
      </div>

      {/* Price Range */}
      <div className="text-sm text-gray-600">
        <div>Import price range:</div>
        <DualRangeSlider value={priceRange} onValueChange={setPriceRange} />
      </div>

      {/* Start Date */}
      <div>
        <label className="block mb-1 font-normal text-sm">Start Date</label>
        <Input
          type="date"
          value={dateFilter.startDate || ""}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block mb-1 font-normal text-sm">End Date</label>
        <Input
          type="date"
          value={dateFilter.endDate || ""}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          className="text-white bg-blue-500 hover:bg-blue-700"
          onClick={applyFilters}
        >
          Apply
        </Button>
        <Button variant="ghost" className="border" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>
    </div>
  );
}