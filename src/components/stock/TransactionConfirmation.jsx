import { useRef, useState } from "react";
import { Button } from "../ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createTransaction } from "@/lib/api/stock";
import { toast } from "sonner";

function formatFullEnglishDate(localeDate) {
  const dateStr = localeDate.split(" ")[1];
  const [day, month, year] = dateStr.split("/").map(Number);

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaySuffix = (d) => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const suffix = getDaySuffix(day);
  const monthName = months[month];

  return `On the ${day}${suffix} of ${monthName}, ${year}`;
}

export default function TransactionConfirmation({
  transactionData,
  selectedPartner,
  selectedEmployee,
  totalAmount,
  onConfirm,
  onCancel,
}) {
  const componentRef = useRef();
  const [isCreating, setIsCreating] = useState(false);

  const generateInvoice = async () => {
    try {
      
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true
      });

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
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.");
    }
  };

  const handleConfirm = async () => {
    setIsCreating(true);
    try {
      await createTransaction(transactionData);
      toast.success("Transaction created successfully.");
      await generateInvoice();
    } catch (error) {
      toast.error(
        "An error occurred while creating the transaction. Please try again or contact the administrator."
      );
    }
    setIsCreating(false);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div ref={componentRef} className="text-center">
          <h2 className="text-2xl font-bold mb-4">INVOICE</h2>
          <div className="text-left space-y-2">
            <p className="font-medium">
              Customer: {selectedPartner?.name || "N/A"}
            </p>
            <p>Phone: {selectedPartner?.phone || "N/A"}</p>
            <p>Address: {selectedPartner?.address || "N/A"}</p>
          </div>

          <div className="mb-4">
            <p className="font-semibold mb-4 uppercase">Transaction Detail</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-center font-medium">Item</th>
                  <th className="border p-2 text-center font-medium">
                    Quantity
                  </th>
                  <th className="border p-2 text-center font-medium">
                    Unit Price ($)
                  </th>
                  <th className="border p-2 text-center font-medium">
                    Total ($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionData.items.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{product.product_name}</td>
                    <td className="border p-2 text-center">
                      {product.quantity}
                    </td>
                    <td className="border p-2 text-center">
                      ${product.price_per_unit.toFixed(2)}
                    </td>
                    <td className="border p-2 text-center">
                      ${(product.quantity * product.price_per_unit).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            <div className="text-left mb-4 space-y-2">
              <p className="font-medium">
                Employee: {selectedEmployee?.name || "N/A"}
              </p>
              <p>Phone: {selectedEmployee?.phone || "N/A"}</p>
            </div>
            <div className="font-bold text-right mt-8">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>
          <p className="text-right mt-4">
            {formatFullEnglishDate(transactionData.time)}
          </p>
          <div
            className="flex flex-col items-end w-full mt-6"
          >
            <p className="font-medium">Employee Signature:</p>
            <div className="border-b border-gray-300 mt-2 w-40"></div>
          </div>
        </div>
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
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create invoice"}
          </Button>
        </div>
      </div>
    </div>
  );
}