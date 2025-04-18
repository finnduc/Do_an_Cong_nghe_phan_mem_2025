function formatDate(isoDate) {
  const date = new Date(isoDate);
  const formatted = date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatted;
}

const test = {
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
};

export default function HistoryCard({ data }) {
  return (
    <div className="bg-white rounded-lg p-2 border-[0.5px] shadow-sm">
      {data.transaction_id ? (
        <div className="flex flex-col gap-1 text-sm">
          {data.action === "export" ? (
            <div className="font-bold text-base text-green-500">Giao dịch xuất hàng</div>
          ) : (
            <div className="font-bold text-base text-red-500">Giao dịch nhập hàng</div>
          )}
          <div>
            {data.action === "export" ? "Nhà cung cấp" : "Khách hàng"}:{" "}
            {data.partner_name}
          </div>
          <div>Nhân viên thực hiện: {data.employee_name}</div>
          <div>
            Sản phẩm: {data.product_name}, nhà sản xuất: {data.manufacturer},
            danh mục: {data.category_name}, số lượng: {data.quantity}, giá mỗi
            sản phẩm: {data.price_per_unit}
          </div>
          <div className="text-gray-500 text-xs">
            {formatDate(data.created_at)}
          </div>
        </div>
      ) : (
        <div>Thêm mới sản phẩm vào kho</div>
      )}
    </div>
  );
}
