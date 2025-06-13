"use client";
import { useState, useEffect, useCallback } from "react";
import { Input } from "../ui/input";
import ParametersTable from "./ParametersTable";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchCatetories,
  fetchManufacturers,
} from "@/lib/api/parameters";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

const CategoryFormContent = ({
  item,
  categoryName,
  setCategoryName,
  handleFormStateUpdate,
}) => {
  useEffect(() => {
    handleFormStateUpdate(item, "category");
  }, [item, handleFormStateUpdate]);

  return (
    <div>
      <Input
        id="category-name"
        type="text"
        placeholder="Enter category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
    </div>
  );
};

const ManufacturerFormContent = ({
  item,
  manufacturerName,
  setManufacturerName,
  handleFormStateUpdate,
}) => {
  useEffect(() => {
    handleFormStateUpdate(item, "manufacturer");
  }, [item, handleFormStateUpdate]);

  return (
    <div>
      <Input
        id="manufacturer-name"
        type="text"
        placeholder="Enter manufacturer name"
        value={manufacturerName}
        onChange={(e) => setManufacturerName(e.target.value)}
      />
    </div>
  );
};

const ProductFormContent = ({
  item,
  categories,
  manufacturers,
  productName,
  setProductName,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedManufacturerId,
  setSelectedManufacturerId,
  handleFormStateUpdate,
}) => {
  useEffect(() => {
    handleFormStateUpdate(item, "product");
  }, [item, handleFormStateUpdate]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select
          value={selectedCategoryId}
          onValueChange={setSelectedCategoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedManufacturerId}
          onValueChange={setSelectedManufacturerId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            {manufacturers.map((man) => (
              <SelectItem key={man.manufacturer_id} value={man.manufacturer_id}>
                {man.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        id="product-name"
        type="text"
        placeholder="Enter product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
    </div>
  );
};

export default function ParametersUI({
  categories: initialCategories,
  manufacturers: initialManufacturers,
  products: initialProducts,
}) {
  const [categories, setCategories] = useState(initialCategories || []);
  const [manufacturers, setManufacturers] = useState(
    initialManufacturers || []
  );
  const [products, setProducts] = useState(initialProducts || []);
  const [categoryName, setCategoryName] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");

  const refreshCategories = async () => {
    try {
      const updatedData = await fetchCatetories();
      setCategories(updatedData?.metadata || []);
    } catch (error) {
      console.error("Error refreshing categories:", error);
      toast.error("Error refreshing categories");
    }
  };

  const refreshManufacturers = async () => {
    try {
      const updatedData = await fetchManufacturers();
      setManufacturers(updatedData?.metadata || []);
    } catch (error) {
      console.error("Error refreshing manufacturers:", error);
      toast.error("Error refreshing manufacturers");
    }
  };

  const refreshProducts = async () => {
    try {
      const updatedData = await fetchProducts(1);

      setProducts(updatedData?.metadata || []);
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("Error refreshing products");
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName) return;
    try {
      await createCategory(categoryName);
      setCategoryName("");
      refreshCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating category");
    }
  };

  const handleEditCategory = async (item) => {
    if (!categoryName || !item?.category_id) return;
    try {
      await updateCategory(item.category_id, categoryName);
      setCategoryName("");
      refreshCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category");
    }
  };

  const handleDeleteCategory = async (item) => {
    if (!item?.category_id) return;
    try {
      await deleteCategory(item.category_id);
      toast.success("Category deleted successfully!");
      refreshCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Cannot be deleted");
    }
  };

  const handleCreateManufacturer = async () => {
    if (!manufacturerName) return;
    try {
      await createManufacturer(manufacturerName);
      setManufacturerName("");
      refreshManufacturers();
    } catch (error) {
      console.error("Error creating manufacturer:", error);
      toast.error("Error creating manufacturer");
    }
  };

  const handleEditManufacturer = async (item) => {
    if (!manufacturerName || !item?.manufacturer_id) return;
    try {
      await updateManufacturer(item.manufacturer_id, manufacturerName);
      setManufacturerName("");
      refreshManufacturers();
    } catch (error) {
      console.error("Error updating manufacturer:", error);
      toast.error("Error updating manufacturer");
    }
  };

  const handleDeleteManufacturer = async (item) => {
    if (!item?.manufacturer_id) return;
    try {
      await deleteManufacturer(item.manufacturer_id);
      toast.success("Manufacturer deleted successfully!");
      refreshManufacturers();
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
      toast.error("cannot be deleted");
    }
  };

  const handleCreateProduct = async () => {
    if (!productName || !selectedCategoryId || !selectedManufacturerId) return;
    try {
      const productData = {
        name_product: productName,
        category_id: selectedCategoryId,
        manufacturer_id: selectedManufacturerId,
      };
      await createProduct(productData);
      setProductName("");
      setSelectedCategoryId("");
      setSelectedManufacturerId("");
      refreshProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product");
    }
  };

  const handleEditProduct = async (item) => {
    if (
      !productName ||
      !selectedCategoryId ||
      !selectedManufacturerId ||
      !item?.parameter_id
    ) {
      console.error("Form data is incomplete.");
      toast.error("Form data is incomplete.");
      return;
    }

    const originalProduct = products.find(
      (p) => p.parameter_id === item.parameter_id
    );
    if (!originalProduct) {
      console.error(
        "Could not find the original product in the local state for parameter_id:",
        item.parameter_id,
        "Current item:",
        item,
        "Current products state:",
        products
      );
      return;
    }

    const productIdToUpdate = originalProduct.product_id;
    if (!productIdToUpdate) {
      console.error(
        "Could not find product_id for the item being edited (originalProduct found but product_id is missing):",
        "Original Product:",
        originalProduct,
        "Current item:",
        item
      );
      return;
    }

    try {
      const productData = {
        parameter_id: item.parameter_id,
        product_id: productIdToUpdate,
        name_product: productName,
        category_id: selectedCategoryId,
        manufacturer_id: selectedManufacturerId,
      };
      await updateProduct(productData);
      setProductName("");
      setSelectedCategoryId("");
      setSelectedManufacturerId("");
      refreshProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (item) => {
    if (!item?.parameter_id) return toast.message("ID ERROR");
    try {
      await deleteProduct(item.parameter_id);
      refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleFormStateUpdate = useCallback(
    (item, type) => {
      if (!item) {
        if (type === "category") setCategoryName("");
        else if (type === "manufacturer") setManufacturerName("");
        else if (type === "product") {
          setProductName("");
          setSelectedCategoryId("");
          setSelectedManufacturerId("");
        }
        return;
      }
      if (type === "category") {
        setCategoryName(item?.name || "");
      } else if (type === "manufacturer") {
        setManufacturerName(item?.name || "");
      } else if (type === "product") {
        setProductName(item?.product_name || "");
        const cat = categories.find((c) => c.name === item?.category_name);
        const man = manufacturers.find(
          (m) => m.name === item?.manufacturer_name
        );
        setSelectedCategoryId(cat?.category_id || "");
        setSelectedManufacturerId(man?.manufacturer_id || "");
      }
    },
    [categories, manufacturers]
  );
  return (
    <div className="flex flex-col lg:flex-row  ">
      <Toaster />
      <div>
        <ParametersTable
          title="Category"
          data={categories}
          scrollAble={true}
          handleCreateParameters={handleCreateCategory}
          handleEditParameters={handleEditCategory}
          handleDeleteParameters={handleDeleteCategory}
        >
          {({ item }) => (
            <CategoryFormContent
              item={item}
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              handleFormStateUpdate={handleFormStateUpdate}
            />
          )}
        </ParametersTable>
      </div>
      <div>
        <ParametersTable
          title="Manufacturer"
          data={manufacturers}
          scrollAble={true}
          handleCreateParameters={handleCreateManufacturer}
          handleEditParameters={handleEditManufacturer}
          handleDeleteParameters={handleDeleteManufacturer}
        >
          {({ item }) => (
            <ManufacturerFormContent
              item={item}
              manufacturerName={manufacturerName}
              setManufacturerName={setManufacturerName}
              handleFormStateUpdate={handleFormStateUpdate}
            />
          )}
        </ParametersTable>
      </div>
      <div>
        <ParametersTable
          title="Product"
          data={products}
          scrollAble={true}
          handleCreateParameters={handleCreateProduct}
          handleEditParameters={handleEditProduct}
          handleDeleteParameters={handleDeleteProduct}
        >
          {({ item }) => (
            <ProductFormContent
              item={item}
              categories={categories}
              manufacturers={manufacturers}
              productName={productName}
              setProductName={setProductName}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              selectedManufacturerId={selectedManufacturerId}
              setSelectedManufacturerId={setSelectedManufacturerId}
              handleFormStateUpdate={handleFormStateUpdate}
            />
          )}
        </ParametersTable>
      </div>
    </div>
  );
}
