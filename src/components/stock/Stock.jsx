'use client';

import { useState } from 'react';
import ReuseTable from '../ReuseTable';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Button } from '../ui/button';

// Mock data
const mockProductsData = {
  data: [
    { product_id: 1, name: "Apple Watch Series 4", category: "Dụng cụ điện tử", manufacturer: "Apple", quantity: 50, import_price: 16500000, sell_price: 17500000 },
    { product_id: 2, name: "iPhone 14", category: "Điện thoại", manufacturer: "Apple", quantity: 100, import_price: 16000000, sell_price: 17000000 },
    { product_id: 3, name: "Samsung S23", category: "Điện thoại", manufacturer: "Samsung", quantity: 30, import_price: 27000000, sell_price: 30500000 },
    { product_id: 4, name: "Dell XPS", category: "Laptop", manufacturer: "Dell", quantity: 15, import_price: 55500000, sell_price: 60499999 },
    { product_id: 5, name: "Airpod", category: "Tai nghe", manufacturer: "Apple", quantity: 200, import_price: 299999, sell_price: 349999 },
    { product_id: 6, name: "Máy in HP", category: "Máy in", manufacturer: "HP", quantity: 40, import_price: 2340000, sell_price: 2700000 },
    { product_id: 7, name: "Oppo Reno 4", category: "Điện thoại", manufacturer: "Oppo", quantity: 20, import_price: 8490000, sell_price: 10790000 },
    { product_id: 8, name: "iPhone 13", category: "Điện thoại", manufacturer: "Apple", quantity: 30, import_price: 11000000, sell_price: 11890000 },
    { product_id: 9, name: "Xiaomi Redmi Note 12", category: "Điện thoại", manufacturer: "Xiaomi", quantity: 20, import_price: 3390000, sell_price: 3790000 },
  ],
  page: 1,
  totalPages: 140,
  totalRecords: 1253,
  limit: 9,
};

const mockManufacturers = [
  { manufacturer_id: "1", name: "Apple" },
  { manufacturer_id: "2", name: "Samsung" },
  { manufacturer_id: "3", name: "Dell" },
  { manufacturer_id: "4", name: "HP" },
  { manufacturer_id: "5", name: "Oppo" },
  { manufacturer_id: "6", name: "Xiaomi" },
];

const mockCategories = [
  { category_id: "1", name: "Dụng cụ điện tử" },
  { category_id: "2", name: "Điện thoại" },
  { category_id: "3", name: "Laptop" },
  { category_id: "4", name: "Tai nghe" },
  { category_id: "5", name: "Máy in" },
];

// Hàm chuyển đổi dữ liệu JSON thành định dạng bảng
const jsonToTableFormat = (data, offset = 0) => {
  const columns = ['ID', 'Tên sản phẩm', 'Danh mục', 'Nhà sản xuất', 'Số lượng', 'Giá nhập', 'Giá bán'];
  const rows = data.map((item, index) => [
    (offset + index + 1).toString(),
    item.name || '',
    item.category || '',
    item.manufacturer || '',
    item.quantity?.toString() || '0',
    item.import_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 đ',
    item.sell_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 đ',
  ]);
  return { columns, rows };
};

export default function Stock() {
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(mockProductsData.page);

  const { columns, rows } = jsonToTableFormat(mockProductsData.data, (currentPage - 1) * mockProductsData.limit);

  const handleResetFilter = () => {
    setManufacturerFilter('');
    setCategoryFilter('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tồn kho</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        {/* Bộ lọc */}
        <div className="flex gap-4 mb-4">
          <div>
            <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nhà sản xuất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                {mockManufacturers.map((man) => (
                  <SelectItem key={man.manufacturer_id} value={man.manufacturer_id}>
                    {man.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </div>
        {/* Bảng */}
        <ReuseTable
          columns={columns}
          rows={rows}
          currentPage={currentPage}
          totalPages={mockProductsData.totalPages}
          totalRecords={mockProductsData.totalRecords}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
}