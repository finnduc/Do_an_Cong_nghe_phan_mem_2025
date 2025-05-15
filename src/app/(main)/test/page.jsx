import TransactionTable from "@/components/export/TransactionTable";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("vi-VN"); // Output: 15/05/2025
}

const transactionData = [
    {
        "header_id": "a1e0f001-1234-11f0-a79c-005056c00001",
        "action": "export",
        "total_amount": "34200.00",
        "created_at": "2025-05-13T17:00:00.000Z",
        "notes": null,
        "partner_name": "FPT",
        "employee_name": "Bui Thi Hoa",
        "items": [
            {
                "item_id": "a1e10001-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 10,
                "manufacturer": "Apple",
                "product_name": "Iphone 15",
                "price_per_unit": 1500
            },
            {
                "item_id": "a1e10002-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 12,
                "manufacturer": "Apple",
                "product_name": "Iphone 16",
                "price_per_unit": 1600
            }
        ]
    },
    {
        "header_id": "a2e0f002-1234-11f0-a79c-005056c00001",
        "action": "import",
        "total_amount": "15000.00",
        "created_at": "2025-05-12T09:30:00.000Z",
        "notes": "Giao hàng lần 1",
        "partner_name": "Samsung",
        "employee_name": "Nguyen Van A",
        "items": [
            {
                "item_id": "a2e10001-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 10,
                "manufacturer": "Samsung",
                "product_name": "Galaxy S23",
                "price_per_unit": 1000
            }
        ]
    },
    {
        "header_id": "a3e0f003-1234-11f0-a79c-005056c00001",
        "action": "export",
        "total_amount": "60000.00",
        "created_at": "2025-05-10T15:45:00.000Z",
        "notes": "Khách cần gấp",
        "partner_name": "Viettel",
        "employee_name": "Tran Thi B",
        "items": [
            {
                "item_id": "a3e10001-1234-11f0-a79c-005056c00001",
                "category": "Laptop",
                "quantity": 5,
                "manufacturer": "Dell",
                "product_name": "XPS 13",
                "price_per_unit": 1200
            },
            {
                "item_id": "a3e10002-1234-11f0-a79c-005056c00001",
                "category": "Laptop",
                "quantity": 5,
                "manufacturer": "HP",
                "product_name": "Spectre x360",
                "price_per_unit": 1000
            }
        ]
    },
    {
        "header_id": "a4e0f004-1234-11f0-a79c-005056c00001",
        "action": "import",
        "total_amount": "8000.00",
        "created_at": "2025-05-09T12:00:00.000Z",
        "notes": null,
        "partner_name": "Asus",
        "employee_name": "Le Van C",
        "items": [
            {
                "item_id": "a4e10001-1234-11f0-a79c-005056c00001",
                "category": "Laptop",
                "quantity": 4,
                "manufacturer": "Asus",
                "product_name": "Zenbook 14",
                "price_per_unit": 2000
            }
        ]
    },
    {
        "header_id": "a5e0f005-1234-11f0-a79c-005056c00001",
        "action": "export",
        "total_amount": "22500.00",
        "created_at": "2025-05-08T08:15:00.000Z",
        "notes": "Khách quen",
        "partner_name": "Mobifone",
        "employee_name": "Nguyen Van D",
        "items": [
            {
                "item_id": "a5e10001-1234-11f0-a79c-005056c00001",
                "category": "Tablet",
                "quantity": 15,
                "manufacturer": "Apple",
                "product_name": "iPad Air",
                "price_per_unit": 1500
            }
        ]
    },
    {
        "header_id": "a6e0f006-1234-11f0-a79c-005056c00001",
        "action": "import",
        "total_amount": "32000.00",
        "created_at": "2025-05-07T10:20:00.000Z",
        "notes": null,
        "partner_name": "Xiaomi",
        "employee_name": "Pham Thi E",
        "items": [
            {
                "item_id": "a6e10001-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 20,
                "manufacturer": "Xiaomi",
                "product_name": "Mi 14",
                "price_per_unit": 800
            }
        ]
    },
    {
        "header_id": "a7e0f007-1234-11f0-a79c-005056c00001",
        "action": "export",
        "total_amount": "10800.00",
        "created_at": "2025-05-06T11:30:00.000Z",
        "notes": "Giao cho chi nhánh Hà Nội",
        "partner_name": "FPT",
        "employee_name": "Hoang Thi F",
        "items": [
            {
                "item_id": "a7e10001-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 6,
                "manufacturer": "Samsung",
                "product_name": "Galaxy A54",
                "price_per_unit": 600
            },
            {
                "item_id": "a7e10002-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 6,
                "manufacturer": "Samsung",
                "product_name": "Galaxy A54",
                "price_per_unit": 600
            }
        ]
    },
    {
        "header_id": "a8e0f008-1234-11f0-a79c-005056c00001",
        "action": "import",
        "total_amount": "45000.00",
        "created_at": "2025-05-05T14:10:00.000Z",
        "notes": null,
        "partner_name": "Apple",
        "employee_name": "Nguyen Thi G",
        "items": [
            {
                "item_id": "a8e10001-1234-11f0-a79c-005056c00001",
                "category": "Tablet",
                "quantity": 10,
                "manufacturer": "Apple",
                "product_name": "iPad Pro",
                "price_per_unit": 1500
            },
            {
                "item_id": "a8e10002-1234-11f0-a79c-005056c00001",
                "category": "Laptop",
                "quantity": 5,
                "manufacturer": "Apple",
                "product_name": "MacBook Pro",
                "price_per_unit": 3000
            }
        ]
    },
    {
        "header_id": "a9e0f009-1234-11f0-a79c-005056c00001",
        "action": "export",
        "total_amount": "5000.00",
        "created_at": "2025-05-04T16:45:00.000Z",
        "notes": "Xuất thử nghiệm",
        "partner_name": "VinSmart",
        "employee_name": "Tran Van H",
        "items": [
            {
                "item_id": "a9e10001-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 10,
                "manufacturer": "VinSmart",
                "product_name": "Star 5",
                "price_per_unit": 500
            }
        ]
    },
    {
        "header_id": "aa0f010a-1234-11f0-a79c-005056c00001",
        "action": "import",
        "total_amount": "20000.00",
        "created_at": "2025-05-03T13:50:00.000Z",
        "notes": null,
        "partner_name": "Oppo",
        "employee_name": "Pham Van I",
        "items": [
            {
                "item_id": "aa100001-1234-11f0-a79c-005056c00001",
                "category": "Điện thoại",
                "quantity": 20,
                "manufacturer": "Oppo",
                "product_name": "Reno10",
                "price_per_unit": 1000
            }
        ]
    }
]


const columns = [
  "Transaction ID",    // header_id
  "Date",               // created_at
  "Product",
  "Action",            // action
  "Partner Name",      // partner_name
  "Employee Name",     // employee_name
  "Notes",             // notes
  "Total Amount"       // total_amount
];

const itemColumns = [
  "Item ID",           // item_id
  "Product Name",      // product_name
  "Category",          // category
  "Manufacturer",      // manufacturer
  "Quantity",          // quantity
  "Price per Unit"     // price_per_unit
];

const rows = transactionData.map(transaction => ({
  data: [
    transaction.header_id,
    formatDate(transaction.created_at),
    `${transaction.items.length} Products`,
    transaction.action,
    transaction.partner_name,
    transaction.employee_name,
    transaction.notes || '',
    transaction.total_amount
  ],
  items: transaction.items.map(item => [
    item.item_id,
    item.product_name,
    item.category,
    item.manufacturer,
    item.quantity,
    item.price_per_unit
  ])
}));


export default function App() {
  return (
    <TransactionTable
      columns={columns}
      rows={rows}
      itemColumns={itemColumns}
      // Add pagination props if needed, e.g., currentPage, totalPages, onPageChange, totalRecords
    />
  );
}