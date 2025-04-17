import HistoryUI from "@/components/history/HistoryUI";
import { fetchHistories } from "@/lib/api/history";
const data = [
  {
    transaction_id: "c8a1db1d-1a6f-11f0-988c-002b67b3f095",
    action: "export",
    quantity: 3,
    price_per_unit: "14500000.00",
    created_at: "2025-04-16T03:06:25.000Z",
    product_name: "Iphone 15 Promax",
    manufacturer: "Apple",
    category_name: "Điện thoại",
    partner_name: "Đỗ Quang Hùng",
    employee_name: "Phạm Việt Giang",
  },
  {
    transaction_id: "579b386e-1957-11f0-988c-002b67b3f095",
    action: "import",
    quantity: 10,
    price_per_unit: "13000000.00",
    created_at: "2025-04-14T17:38:57.000Z",
    product_name: "S21 ultra",
    manufacturer: "Sam Sung",
    category_name: "Điện thoại",
    partner_name: "Đại lý FPT",
    employee_name: "Đỗ Đức An",
  },
  {
    transaction_id: "579b386e-1957-11f0-988c-002b67b3f095",
    action: "import",
    quantity: 10,
    price_per_unit: "13000000.00",
    created_at: "2025-04-14T17:38:57.000Z",
    product_name: "S21 ultra",
    manufacturer: "Sam Sung",
    category_name: "Điện thoại",
    partner_name: "Đại lý FPT",
    employee_name: "Đỗ Đức An",
  },
  {
    transaction_id: "579b386e-1957-11f0-988c-002b67b3f095",
    action: "import",
    quantity: 10,
    price_per_unit: "13000000.00",
    created_at: "2025-04-14T17:38:57.000Z",
    product_name: "S21 ultra",
    manufacturer: "Sam Sung",
    category_name: "Điện thoại",
    partner_name: "Đại lý FPT",
    employee_name: "Đỗ Đức An",
  },
  {
    transaction_id: "579b386e-1957-11f0-988c-002b67b3f095",
    action: "import",
    quantity: 10,
    price_per_unit: "13000000.00",
    created_at: "2025-04-14T17:38:57.000Z",
    product_name: "S21 ultra",
    manufacturer: "Sam Sung",
    category_name: "Điện thoại",
    partner_name: "Đại lý FPT",
    employee_name: "Đỗ Đức An",
  },
  {
    transaction_id: "579b386e-1957-11f0-988c-002b67b3f095",
    action: "import",
    quantity: 10,
    price_per_unit: "13000000.00",
    created_at: "2025-04-14T17:38:57.000Z",
    product_name: "S21 ultra",
    manufacturer: "Sam Sung",
    category_name: "Điện thoại",
    partner_name: "Đại lý FPT",
    employee_name: "Đỗ Đức An",
  },
  {
    transaction_id: "579b386e-1957-11f0-988c-002b67b3f095",
    action: "import",
    quantity: 10,
    price_per_unit: "13000000.00",
    created_at: "2025-04-14T17:38:57.000Z",
    product_name: "S21 ultra",
    manufacturer: "Sam Sung",
    category_name: "Điện thoại",
    partner_name: "Đại lý FPT",
    employee_name: "Đỗ Đức An",
  },
  {
    transaction_id: "579b386e-1957-11f0-988c-002b67b3f095",
    action: "import",
    quantity: 10,
    price_per_unit: "13000000.00",
    created_at: "2025-04-14T17:38:57.000Z",
    product_name: "S21 ultra",
    manufacturer: "Sam Sung",
    category_name: "Điện thoại",
    partner_name: "Đại lý FPT",
    employee_name: "Đỗ Đức An",
  },
];

export default async function HistoryPage() {
  const initialData = await fetchHistories(1)
  return <div className="text-black h-full">
    <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Lịch sử
      </h1>
    <HistoryUI dataList={data} />
  </div>;
}
