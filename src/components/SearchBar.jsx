
'use client';
import { Search } from 'lucide-react';
export default function SearchBar({value, onValueChange, placeholderText = "Search..."}) {
  return (
    <div className="flex items-center bg-blue-500 w-fit rounded-sm mb-2 shadow-sm">
      <Search className="py-1 px-2 text-white" size={30} />
      <input
        type="text"
        className="border-input border rounded-r-sm p-2 focus:outline-none font-light text-sm"
        placeholder={placeholderText} 
        value={value || ""}
        onChange={onValueChange}
      />
    </div>
  );
}