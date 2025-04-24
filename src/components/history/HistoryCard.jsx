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

export default function HistoryCard({ data }) {
  return (
    <div className="bg-white rounded-lg p-2 border-[0.5px] shadow-sm">
      <div className="flex flex-col gap-1 text-sm">
        {data.action === "export" ? (
          <div className="font-bold text-base text-green-500">
            Export transaction
          </div>
        ) : (
          <div className="font-bold text-base text-red-500">
            Import transaction
          </div>
        )}
        <div>
          {data.action === "export" ? "Supplier" : "Customer"}:{" "}
          {data.partner_name}
        </div>
        <div>Handle by: {data.employee_name}</div>
        <div>
          Product name: {data.product_name}, manufacturer: {data.manufacturer},
          category: {data.category_name}, quantity: {data.quantity}, price per
          unit: {data.price_per_unit}
        </div>
        <div className="text-gray-500 text-xs">
          {formatDate(data.created_at)}
        </div>
      </div>
    </div>
  );
}
