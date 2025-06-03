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
        {/* Manufacturer Select */}
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
      {/* Product Name Input */}
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

// --- Component chính ParametersUI ---
export default function ParametersUI({
  categories: initialCategories,
  manufacturers: initialManufacturers,
  products: initialProducts,
}) {
  // --- State Management (Giữ nguyên) ---
  const [categories, setCategories] = useState(initialCategories || []);
  const [manufacturers, setManufacturers] = useState(
    initialManufacturers || []
  );
  const [products, setProducts] = useState(initialProducts || []); // Use state for products

  // State for form inputs (Giữ nguyên)
  const [categoryName, setCategoryName] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedManufacturerId, setSelectedManufacturerId] = useState("");

  // --- Data Refresh Functions (Giữ nguyên) ---
  const refreshCategories = async () => {
    try {
      const updatedData = await fetchCatetories();
      setCategories(updatedData?.metadata || []);
    } catch (error) {
      console.error("Error refreshing categories:", error);
    }
  };

  const refreshManufacturers = async () => {
    try {
      const updatedData = await fetchManufacturers();
      setManufacturers(updatedData?.metadata || []);
    } catch (error) {
      console.error("Error refreshing manufacturers:", error);
    }
  };

  const refreshProducts = async () => {
    try {
      const updatedData = await fetchProducts(1); // Fetch page 1
      // Cập nhật state products thay vì initialProducts
      setProducts(updatedData?.metadata || []);
    } catch (error) {
      console.error("Error refreshing products:", error);
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
      toast.error("cannot be deleted");
    }
  };

  // --- Handlers for Manufacturer ---
  const handleCreateManufacturer = async () => {
    if (!manufacturerName) return;
    try {
      await createManufacturer(manufacturerName);
      setManufacturerName("");
      refreshManufacturers();
    } catch (error) {
      console.error("Error creating manufacturer:", error);
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

  // --- Handlers for Product (Parameter) ---
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
    }
  };

  const handleEditProduct = async (item) => {
    if (
      !productName ||
      !selectedCategoryId ||
      !selectedManufacturerId ||
      !item?.parameter_id
    ) {
      // Có thể thêm toast thông báo ở đây nếu các trường form chưa được điền
      console.error("Form data is incomplete.");
      return;
    }

    const originalProduct = products.find(
      (p) => p.parameter_id === item.parameter_id
    );

    // Kiểm tra xem originalProduct có tồn tại không
    if (!originalProduct) {
      console.error(
        "Could not find the original product in the local state for parameter_id:",
        item.parameter_id,
        "Current item:",
        item,
        "Current products state:",
        products // Log thêm state products để debug
      );
      // Hiển thị thông báo lỗi cho người dùng, ví dụ dùng toast
      // toast.error("Không tìm thấy thông tin sản phẩm gốc. Vui lòng thử làm mới trang.");
      return;
    }

    const productIdToUpdate = originalProduct.product_id; // Bây giờ originalProduct chắc chắn tồn tại

    // Kiểm tra productIdToUpdate (quan trọng!)
    if (!productIdToUpdate) {
      console.error(
        "Could not find product_id for the item being edited (originalProduct found but product_id is missing):",
        "Original Product:",
        originalProduct,
        "Current item:",
        item
      );
      // Hiển thị thông báo lỗi cho người dùng
      // toast.error("Sản phẩm gốc thiếu thông tin product_id. Không thể cập nhật.");
      return;
    }

    try {
      const productData = {
        parameter_id: item.parameter_id,
        product_id: productIdToUpdate, // Đã được kiểm tra
        name_product: productName,
        category_id: selectedCategoryId,
        manufacturer_id: selectedManufacturerId,
      };
      await updateProduct(productData);
      setProductName("");
      setSelectedCategoryId("");
      setSelectedManufacturerId("");
      refreshProducts(); // Đảm bảo refreshProducts hoạt động đúng và cập nhật state products
      // với dữ liệu mới nhất và đầy đủ từ API
      // toast.success("Sản phẩm đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating product:", error);
      // toast.error(error.message || "Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  const handleDeleteProduct = async (item) => {
    if (!item?.parameter_id) return toast.message("loi load id");
    try {
      await deleteProduct(item.parameter_id);
      refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // --- Form State Update Function (Giữ nguyên) ---
  const handleFormStateUpdate = useCallback(
    (item, type) => {
      if (!item) {
        // Reset for Create modal
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

  // --- JSX Structure (Theo yêu cầu của bạn) ---
  return (
    // Sử dụng class gốc bạn cung cấp
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-white rounded-lg border">
      <Toaster />
      <div>
        <ParametersTable
          title="Category"
          data={categories}
          scrollAble={true} // Giữ scrollAble nếu bạn muốn
          handleCreateParameters={handleCreateCategory} // Sửa lại đúng handler
          handleEditParameters={handleEditCategory}
          handleDeleteParameters={handleDeleteCategory}
        >
          {(
            { item } // Render wrapper component
          ) => (
            <CategoryFormContent
              item={item}
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              handleFormStateUpdate={handleFormStateUpdate}
            />
          )}
        </ParametersTable>
      </div>

      {/* Manufacturer Table (Không có flex-1, min-w-0) */}
      <div>
        <ParametersTable
          title="Manufacturer"
          data={manufacturers}
          scrollAble={true} // Giữ scrollAble nếu bạn muốn
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
          //onPageChange={getNexPage}
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
