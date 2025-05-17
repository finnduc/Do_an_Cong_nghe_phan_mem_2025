import { useRef } from "react";
import { Button } from "../ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TransactionConfirmation({
  transactionData,
  selectedPartner,
  selectedEmployee,
  totalAmount,
  onConfirm,
  onCancel,
}) {
  const componentRef = useRef();
  const signatureRef = useRef();

  const generateInvoice = async () => {
    if (signatureRef.current) {
      signatureRef.current.style.display = "block";
    }

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
    });

    if (signatureRef.current) {
      signatureRef.current.style.display = "none";
    }

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const imgWidth = 180; // thu hẹp chiều ngang để tạo padding
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = (pageWidth - imgWidth) / 2;

    let position = 10;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", x, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", x, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("invoice.pdf");
  };

  const handleConfirm = () => {
    generateInvoice(); // Tạo và tải hóa đơn
    onConfirm(); // Tiếp tục xử lý xác nhận giao dịch
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div ref={componentRef}>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Transaction Confirmation
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Transaction Type
                </p>
                <p className="text-base capitalize">{transactionData.action}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Transaction Date
                </p>
                <p className="text-base">{transactionData.transaction_date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {transactionData.action === "import"
                    ? "Supplier"
                    : "Customer"}
                </p>
                <p className="text-base">{selectedPartner?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {transactionData.action === "import"
                    ? "Supplier"
                    : "Customer"}{" "}
                  Phone
                </p>
                <p className="text-base">{selectedPartner?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {transactionData.action === "import"
                    ? "Supplier"
                    : "Customer"}{" "}
                  Address
                </p>
                <p className="text-base">{selectedPartner?.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Employee</p>
                <p className="text-base">{selectedEmployee?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Employee Phone
                </p>
                <p className="text-base">{selectedEmployee?.phone || "N/A"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Products</p>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left font-medium">
                      Product Name
                    </th>
                    <th className="border p-2 text-left font-medium">
                      Quantity
                    </th>
                    <th className="border p-2 text-left font-medium">
                      Price per Unit
                    </th>
                    <th className="border p-2 text-left font-medium">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.items.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{product.product_name}</td>
                      <td className="border p-2">{product.quantity}</td>
                      <td className="border p-2">
                        ${product.price_per_unit.toFixed(2)}
                      </td>
                      <td className="border p-2">
                        $
                        {(product.quantity * product.price_per_unit).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <p className="text-sm font-medium text-gray-600">Total Amount:</p>
              <p className="text-base font-semibold ml-2">
                ${totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Phần chữ ký ẩn trong UI, hiển thị trong PDF */}
            <div
              ref={signatureRef}
              style={{ display: "none" }}
              className="mt-6 grid grid-cols-2 gap-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {transactionData.action === "import"
                    ? "Supplier"
                    : "Customer"}{" "}
                  Signature
                </p>
                <div
                  className="border-b border-gray-300 mt-2"
                  style={{ width: "200px" }}
                ></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Employee Signature
                </p>
                <div
                  className="border-b border-gray-300 mt-2"
                  style={{ width: "200px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Button nằm ngoài khu vực chụp */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
