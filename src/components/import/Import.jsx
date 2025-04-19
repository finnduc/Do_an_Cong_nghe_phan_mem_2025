'use client';

import { useState } from 'react';
import ReuseTable from '../ReuseTable';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@radix-ui/react-dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock data
const mockTransactionsImport = {
  data: [
    { id: 1, product_name: "iPhone 14", supplier: "TechSupplier VN", employee: "Nguyen Van A", quantity: 10, price_per_unit: 17500000, total: 175000000, time: "17-02-2025 10:38" },
    { id: 2, product_name: "Dell XPS", supplier: "SuperTech", employee: "Lê Văn C", quantity: 5, price_per_unit: 60000000, total: 300000000, time: "17-02-2025 14:30" },
    { id: 3, product_name: "Samsung S23", supplier: "Thegioididong", employee: "Trinh Thi B", quantity: 10, price_per_unit: 30000000, total: 300000000, time: "16-02-2025 12:59:01" },
    { id: 4, product_name: "AirPods", supplier: "Apple", employee: "Pham Van G", quantity: 100, price_per_unit: 299999, total: 29999900, time: "16-03-2025 10:43:32" },
    { id: 5, product_name: "Dell XPS", supplier: "Saigon Tech Hub", employee: "Nguyen Van A", quantity: 5, price_per_unit: 60499999, total: 302499995, time: "14-01-2025 09:23:32" },
    { id: 6, product_name: "Galaxy Watch", supplier: "Hanoi Electronics", employee: "Ly Ty", quantity: 20, price_per_unit: 3500000, total: 70000000, time: "15-01-2025 14:33:54" },
    { id: 7, product_name: "Máy in HP", supplier: "Photocopy Bich Nhu", employee: "Le Van Tho", quantity: 10, price_per_unit: 2700000, total: 27000000, time: "06-01-2025 14:12:03" },
    { id: 8, product_name: "Acer Nitro 5 Tiger", supplier: "Đại Lý Laptop GM", employee: "Đặng Ngọc Mai", quantity: 10, price_per_unit: 20500000, total: 205000000, time: "04-01-2025 16:40:31" },
    { id: 9, product_name: "Oppo Reno 4", supplier: "CanTho Trading", employee: "Cao Bach Nhue", quantity: 10, price_per_unit: 10790000, total: 107900000, time: "13-03-2025 12:23:14" },
  ],
  page: 1,
  totalPages: 104,
  totalRecords: 936,
  limit: 9,
};

const mockProducts = [
  { product_id: "1", name: "iPhone 14", category_id: "2", manufacturer_id: "1" },
  { product_id: "2", name: "Dell XPS", category_id: "3", manufacturer_id: "3" },
  { product_id: "3", name: "Samsung S23", category_id: "2", manufacturer_id: "2" },
  { product_id: "4", name: "Airpod", category_id: "4", manufacturer_id: "1" },
  { product_id: "5", name: "Acer Nitro 5", category_id: "3", manufacturer_id: "7" },
];

const mockSuppliers = [
  { partner_id: "1", name: "TechSupplier VN" },
  { partner_id: "2", name: "SuperTech" },
  { partner_id: "3", name: "Thegioididong" },
  { partner_id: "4", name: "Apple" },
  { partner_id: "5", name: "Saigon Tech Hub" },
  { partner_id: "6", name: "Hanoi Electronics" },
  { partner_id: "7", name: "Photocopy Bich Nhu" },
  { partner_id: "8", name: "Đại Lý Laptop GM" },
  { partner_id: "9", name: "CanTho Trading" },
];

const mockEmployees = [
  { employee_id: "1", name: "Nguyen Van A" },
  { employee_id: "2", name: "Lê Văn C" },
  { employee_id: "3", name: "Trinh Thi B" },
  { employee_id: "4", name: "Pham Van G" },
  { employee_id: "5", name: "Ly Ty" },
  { employee_id: "6", name: "Le Van Tho" },
  { employee_id: "7", name: "Đặng Ngọc Mai" },
  { employee_id: "8", name: "Cao Bach Nhue" },
];

const mockCategories = [
  { category_id: "1", name: "Dụng cụ điện tử" },
  { category_id: "2", name: "Điện thoại" },
  { category_id: "3", name: "Laptop" },
  { category_id: "4", name: "Tai nghe" },
  { category_id: "5", name: "Máy in" },
];

const mockManufacturers = [
  { manufacturer_id: "1", name: "Apple" },
  { manufacturer_id: "2", name: "Samsung" },
  { manufacturer_id: "3", name: "Dell" },
  { manufacturer_id: "4", name: "HP" },
  { manufacturer_id: "5", name: "Oppo" },
  { manufacturer_id: "6", name: "Xiaomi" },
  { manufacturer_id: "7", name: "Acer" },
];

// Hàm chuyển đổi dữ liệu JSON thành định dạng bảng
const jsonToTableFormat = (data, offset = 0) => {
  const columns = [
    'ID',
    'Tên sản phẩm',
    'Nguồn cung cấp',
    'Nhân viên',
    'Số lượng',
    'Giá trị mỗi đơn vị',
    'Tổng cộng',
    'Thời gian',
  ];
  const rows = data.map((item, index) => [
    (offset + index + 1).toString(),
    item.product_name || '',
    item.supplier || '',
    item.employee || '',
    item.quantity?.toString() || '0',
    item.price_per_unit?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 đ',
    item.total?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 đ',
    item.time || '',
  ]);
  return { columns, rows };
};

const formSchema = z.object({
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  manufacturerId: z.string().min(1, 'Vui lòng chọn nhà sản xuất'),
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  supplierId: z.string().min(1, 'Vui lòng chọn nguồn cung cấp'),
  employeeId: z.string().min(1, 'Vui lòng chọn nhân viên'),
  quantity: z.string().transform((val) => Number(val)).refine((val) => val > 0, 'Số lượng phải lớn hơn 0'),
  pricePerUnit: z.string().transform((val) => Number(val)).refine((val) => val > 0, 'Giá phải lớn hơn 0'),
});

export default function Import() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(mockTransactionsImport.page);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: '',
      manufacturerId: '',
      productId: '',
      supplierId: '',
      employeeId: '',
      quantity: '',
      pricePerUnit: '',
    },
  });

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    form.setValue('categoryId', value);
    filterProducts(value, selectedManufacturer);
  };

  const handleManufacturerChange = (value) => {
    setSelectedManufacturer(value);
    form.setValue('manufacturerId', value);
    filterProducts(selectedCategory, value);
  };

  const filterProducts = (categoryId, manufacturerId) => {
    let filtered = mockProducts;
    if (categoryId) {
      filtered = filtered.filter((p) => p.category_id === categoryId);
    }
    if (manufacturerId) {
      filtered = filtered.filter((p) => p.manufacturer_id === manufacturerId);
    }
    setFilteredProducts(filtered);
  };

  const onSubmit = (values) => {
    console.log('Nhập kho:', values);
    setOpen(false);
    form.reset();
  };

  const { columns, rows } = jsonToTableFormat(mockTransactionsImport.data, (currentPage - 1) * mockTransactionsImport.limit);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Nhập kho</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-700">Tạo dịch vụ nhập kho</Button>
          </DialogTrigger>
          <DialogContent className="bg-white p-6 rounded-lg shadow">
            <DialogHeader>
              <DialogTitle>Vui lòng nhập thông tin</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCategories.map((cat) => (
                              <SelectItem key={cat.category_id} value={cat.category_id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manufacturerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhà sản xuất</FormLabel>
                        <Select onValueChange={handleManufacturerChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhà sản xuất" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockManufacturers.map((man) => (
                              <SelectItem key={man.manufacturer_id} value={man.manufacturer_id}>
                                {man.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên sản phẩm</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn sản phẩm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredProducts.map((product) => (
                              <SelectItem key={product.product_id} value={product.product_id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Nhập số lượng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá nhập</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Nhập giá nhập" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nguồn cung cấp</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nguồn cung cấp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSuppliers.map((supplier) => (
                              <SelectItem key={supplier.partner_id} value={supplier.partner_id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhân viên</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhân viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockEmployees.map((employee) => (
                              <SelectItem key={employee.employee_id} value={employee.employee_id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-700 w-full">
                  Nhập kho
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <ReuseTable
          columns={columns}
          rows={rows}
          currentPage={currentPage}
          totalPages={mockTransactionsImport.totalPages}
          totalRecords={mockTransactionsImport.totalRecords}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
}