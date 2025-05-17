'use client'
import React, { useState } from 'react';

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const formatted = date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatted;
}

export default function HistoryCard({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-3 overflow-hidden">
      {/* Transaction Header - Always visible */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={toggleExpand}
      >
        {/* Left side - Transaction type and basic info */}
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            data.action === "export" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}>
            {data.action === "export" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H6a1 1 0 100 2h3v5a1 1 0 102 0v-5h3a1 1 0 100-2h-3V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
 |              </svg>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`font-medium truncate ${data.action === "export" ? "text-green-600" : "text-red-600"}`}>
              {data.action === "export" ? "Export transaction" : "Import transaction"}
            </div>
            <div className="text-gray-600 text-sm truncate">
              {data.action === "export" ? "Supplier" : "Customer"}: {data.partner_name}
            </div>
          </div>
        </div>
        
        {/* Right side - Amount and expand arrow */}
        <div className="flex items-center">
          <div className="text-right mr-3">
            <div className="font-semibold">${data.total_amount}</div>
            <div className="text-gray-500 text-xs">{formatDate(data.created_at)}</div>
          </div>
          
          <svg 
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Expandable Content - Only visible when expanded */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-3">
              Handled by: {data.employee_name}
            </div>
            
            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium whitespace-nowrap">Product</th>
                    <th className="text-center py-2 px-3 font-medium whitespace-nowrap">Quantity</th>
                    <th className="text-right py-2 px-3 font-medium whitespace-nowrap">Price</th>
                    <th className="text-right py-2 px-3 font-medium whitespace-nowrap">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.items.length > 0 ? (
                    data.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="hover:bg-gray-100">
                        <td className="py-2 px-3 whitespace-nowrap">{item.product_name}</td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">{item.quantity}</td>
                        <td className="py-2 px-3 text-right whitespace-nowrap">${item.price_per_unit}</td>
                        <td className="py-2 px-3 text-right font-medium whitespace-nowrap">
                          ${(item.quantity * item.price_per_unit).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-3 px-3 text-center text-gray-500">
                        No products available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer with summary */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {data.items && Array.isArray(data.items) ? data.items.length : 0} {data.items && data.items.length === 1 ? 'product' : 'products'}
              </div>
              <div className="font-medium">
                Total: <span className="font-bold">${data.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}