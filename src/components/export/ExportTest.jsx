import TransactionTable from "./TransactionTable";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("vi-VN"); // Output: 15/05/2025
}

function formatTransactionData(transactionData) {
  const formattedRows = transactionData.map((transaction) => ({
    data: [
      transaction.header_id,
      formatDate(transaction.created_at),
      `${transaction.items.length} Products`,
      transaction.action,
      transaction.partner_name,
      transaction.employee_name,
      transaction.notes || "",
      transaction.total_amount,
    ],
    items: transaction.items.map((item) => [
      item.item_id,
      item.product_name,
      item.category,
      item.manufacturer,
      item.quantity,
      item.price_per_unit,
    ]),
  }));
  return formattedRows;
}

const columns = [
  "Transaction ID", // header_id
  "Date", // created_at
  "Product",
  "Action", // action
  "Partner Name", // partner_name
  "Employee Name", // employee_name
  "Notes", // notes
  "Total Amount", // total_amount
];

const itemColumns = [
  "Item ID", // item_id
  "Product Name", // product_name
  "Category", // category
  "Manufacturer", // manufacturer
  "Quantity", // quantity
  "Price per Unit", // price_per_unit
];

export default function ExportTest({ data }) {
  console.log(data);
  return (
    <TransactionTable
      columns={columns}
      rows={formatTransactionData(data.metadata.data)}
      itemColumns={itemColumns}
      currentPage={data.metadata.page}
      totalPages={data.metadata.totalPage}
      totalRecords={data.metadata.total}
    />
  );
}
