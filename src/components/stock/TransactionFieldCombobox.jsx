'use client';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function TransactionFieldCombobox({
  items,
  valueField,
  labelField,
  inputValue,
  setInputValue,
  placeholder = "Select item...",
}) {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find(
    (item) => String(item[valueField]) === String(inputValue)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedItem ? selectedItem[labelField] : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item[valueField]}
                  value={item[labelField]} // Tìm kiếm theo nhãn
                  onSelect={() => {
                    setInputValue(String(item[valueField])); // Cập nhật giá trị
                    setOpen(false);
                  }}
                >
                  {item[labelField]}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      String(inputValue) === String(item[valueField])
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}