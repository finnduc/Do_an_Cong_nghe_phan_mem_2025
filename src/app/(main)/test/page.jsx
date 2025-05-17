'use client'; // nếu bạn dùng app router

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Home() {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Đặt font hỗ trợ tiếng Việt
    doc.setFont('Arial');
    // Đặt màu văn bản thành đen
    doc.setTextColor(0, 0, 0);

    // Thêm tiêu đề
    doc.text('HÓA ĐƠN BÁN HÀNG', 80, 10);
    doc.text('Mã đơn hàng: HD003362', 80, 18);
    doc.text('Ngày: 08/05/2014 - 08:56', 80, 26);

    // Cấu hình bảng với font và màu trắng đen
    autoTable(doc, {
      startY: 35,
      head: [['STT', 'Mã hàng', 'Tên hàng', 'Số lượng', 'Đơn giá', 'Chiết khấu', 'Thành tiền']],
      body: [
        ['1', '3050412', 'Váy nữ Alcado', '3', '223,962', '', '671,886'],
        ['2', 'P0000015', 'Quần jeans nữ Blue Exchange', '2', '210,323', '', '420,646'],
      ],
      theme: 'plain', // Không dùng màu nền hoặc viền
      styles: { font: 'Arial', textColor: [0, 0, 0] }, // Font Arial, chữ đen
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Đầu bảng trắng, chữ đen
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Thân bảng trắng, chữ đen
    });

    // Thêm tổng kết
    doc.text('Tổng tiền hàng: 1,192,532', 14, doc.lastAutoTable.finalY + 10);
    doc.text('Chiết khấu hóa đơn: 100,000', 14, doc.lastAutoTable.finalY + 18);
    doc.text('Tổng cộng: 1,092,532', 14, doc.lastAutoTable.finalY + 26);

    // Lưu file PDF
    doc.save('hoa-don.pdf');
  };

  return (
    <div className="p-4">
      <button
        onClick={generatePDF}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Xuất hóa đơn PDF
      </button>
    </div>
  );
}