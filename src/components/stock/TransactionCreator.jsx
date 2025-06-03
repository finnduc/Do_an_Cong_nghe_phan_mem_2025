import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import TransactionConfirmation from "./TransactionConfirmation";
import TransactionFieldCombobox from "./TransactionFieldCombobox";
import ProductCombobox from "./ProductCombobox";

export default function TransactionCreator({
  resetFilters,
  manufacturerFilter,
  setManufacturerFilter,
  categoryFilter,
  setCategoryFilter,
  manufacturers,
  categories,
  onRefreshData,
  employees,
  partners,
  products,
  setProductFilter,
  productFilter,
}) {
  const [involvedProducts, setInvolvedProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [transactionType, setTransactionType] = useState("export");
  const [priceInput, setPriceInput] = useState(0);
  const [partnerIdInput, setPartnerIdInput] = useState("");
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [emptyMessage, setEmptyMessage] = useState("");
  const [requiredMessage, setRequiredMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const handleQuantityInput = (e) => {
    const max = currentProduct ? currentProduct.quantity : 1000;
    const min = 1;
    const inputValue = e.target.value;

    if (inputValue === "") {
      setCurrentProduct({ ...currentProduct, selectedQuantity: undefined });
      return;
    }

    let value = Number(inputValue);
    if (isNaN(value)) value = min;
    if (transactionType === 'export'){
      if (value > max) value = max;
    }
    if (value < min) value = min;

    setCurrentProduct({ ...currentProduct, selectedQuantity: value });
  };

  const handlePriceInput = (e) => {
    const min = 0;
    const inputValue = e.target.value;

    if (inputValue === "") {
      setPriceInput("");
      return;
    }

    let value = Number(inputValue);
    if (value < min) value = min;

    setPriceInput(value);
  };

  const handleAddProduct = () => {
    if (
      !currentProduct ||
      !currentProduct.selectedQuantity ||
      (priceInput === "" && transactionType === "import") ||
      !currentProduct.product_name ||
      !currentProduct.stock_id
    ) {
      setRequiredMessage(
        "Please fill in all the required fields before adding the product."
      );
      return;
    }
    setInvolvedProducts((prev) => [
      ...prev,
      {
        stock_id: currentProduct.stock_id,
        product_name: currentProduct.product_name,
        quantity: currentProduct.selectedQuantity,
        price_per_unit:
          transactionType === "import"
            ? Number(priceInput)
            : Number(currentProduct.product_price_export),
      },
    ]);
    resetFilters();
    setIsAddingProduct(false);
    setRequiredMessage("");
    setPriceInput("");
    setCurrentProduct(null);
  };

  const totalAmount = involvedProducts.reduce(
    (total, item) => total + item.price_per_unit * item.quantity,
    0
  );

  const transactionData = {
    action: transactionType,
    items: involvedProducts,
    partner_id: partnerIdInput,
    employee_id: employeeIdInput,
    time: new Date().toLocaleString(),
  };

  const handleCreateTransaction = () => {
    for (const [key, value] of Object.entries(transactionData)) {
      const isEmpty =
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0);
      if (isEmpty) {
        setEmptyMessage(
          "Please fill in all the required fields before creating the transaction."
        );
        return;
      }
    }
    setEmptyMessage("");
    setIsConfirming(true);
  };

  const handleConfirmTransaction = () => {
    console.log("Transaction confirmed:", transactionData);
    setIsConfirming(false);
    setInvolvedProducts([]);
    setPartnerIdInput("");
    setEmployeeIdInput("");
    setTransactionType("export");
    onRefreshData();
  };

  const selectedPartner = partners.find(
    (partner) => partner.partner_id === partnerIdInput
  );
  const selectedEmployee = employees.find(
    (employee) => employee.employee_id === employeeIdInput
  );

  return (
    <div className="pb-8 flex flex-col gap-4">
      <TransactionFieldCombobox
        items={employees}
        valueField="employee_id"
        labelField="name"
        placeholder="Select employee..."
        inputValue={employeeIdInput}
        setInputValue={setEmployeeIdInput}
      />
      <TransactionFieldCombobox
        items={partners}
        valueField="partner_id"
        labelField="name"
        placeholder="Select partner..."
        inputValue={partnerIdInput}
        setInputValue={setPartnerIdInput}
      />
      <Select
        onValueChange={(value) => {
          setTransactionType(value);
          setInvolvedProducts([]);
          resetFilters();
          setCurrentProduct(null);
        }}
        value={transactionType}
      >
        <SelectTrigger>
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="import">Import</SelectItem>
          <SelectItem value="export">Export</SelectItem>
        </SelectContent>
      </Select>
      {involvedProducts.length > 0 && (
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Product Name</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Price per Unit</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {involvedProducts.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-2">{product.product_name}</td>
                <td className="border p-2">{product.quantity}</td>
                <td className="border p-2">{product.price_per_unit}</td>
                <td className="border p-2 text-center">
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setInvolvedProducts(
                        involvedProducts.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <X size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="self-end">Total amount: {totalAmount}</div>
      {isAddingProduct && (
        <div className="rounded-lg border p-2 flex flex-col gap-2">
          <button
            className="self-end text-end text-xs text-red-500 cursor-pointer"
            onClick={() => {
              resetFilters();
              setCurrentProduct(null);
            }}
          >
            Reset
          </button>
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
            <Select
              onValueChange={setManufacturerFilter}
              value={manufacturerFilter}
            >
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
          <ProductCombobox
            items={products}
            valueField="stock_id"
            labelField="product_name"
            inputValue={currentProduct?.stock_id}
            setInputValue={setCurrentProduct}
            searchValue={productFilter}
            setSearchValue={setProductFilter}
            setCategoryFilter={setCategoryFilter}
            setManufacturerFilter={setManufacturerFilter}
          />
          <label htmlFor="quantity" className="text-sm">
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            className="p-1 border rounded-md focus:outline-0 w-full"
            max={currentProduct && transactionType !== "import" ? currentProduct.quantity : 1000}
            min={1}
            value={currentProduct?.selectedQuantity ?? ""}
            onChange={handleQuantityInput}
            onBlur={() => {
              if (
                !currentProduct?.selectedQuantity ||
                isNaN(currentProduct.selectedQuantity)
              ) {
                setCurrentProduct({ ...currentProduct, selectedQuantity: 1 });
              }
            }}
          />
          <label htmlFor="price_per_unit" className="text-sm">
            Price per unit:
          </label>
          <input
            id="price_per_unit"
            type="number"
            className="p-1 border rounded-md focus:outline-0 w-full"
            value={
              transactionType === "import"
                ? priceInput
                : currentProduct?.product_price_export ?? ""
            }
            disabled={transactionType !== "import"}
            min={0}
            onChange={handlePriceInput}
          />
          <div className="flex gap-2">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-700"
              onClick={handleAddProduct}
            >
              Done
            </Button>
            <Button
              className="w-full bg-red-500 hover:bg-red-700"
              onClick={() => setIsAddingProduct(false)}
            >
              Cancel
            </Button>
          </div>
          {requiredMessage && (
            <div className="text-red-500 text-sm">{requiredMessage}</div>
          )}
        </div>
      )}
      <Button
        className="w-full text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white bg-white"
        onClick={() => setIsAddingProduct(true)}
      >
        <Plus size={25} /> Add product
      </Button>
      <Button
        className="w-full bg-blue-500 hover:bg-blue-700"
        onClick={handleCreateTransaction}
        disabled={isAddingProduct || involvedProducts.length === 0}
      >
        Create
      </Button>
      {emptyMessage && (
        <div className="text-red-500 text-sm">{emptyMessage}</div>
      )}
      {isConfirming && (
        <TransactionConfirmation
          transactionData={transactionData}
          selectedPartner={selectedPartner}
          selectedEmployee={selectedEmployee}
          totalAmount={totalAmount}
          onConfirm={handleConfirmTransaction}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}
