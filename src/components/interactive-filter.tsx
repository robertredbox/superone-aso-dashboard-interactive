"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface FilterOption {
  value: string;
  label: string;
}

interface InteractiveFilterProps {
  title: string;
  options: FilterOption[];
  defaultValue?: string;
  onValueChange: (value: string) => void;
}

export function InteractiveFilter({
  title,
  options,
  defaultValue,
  onValueChange,
}: InteractiveFilterProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onValueChange(currentValue);
    setOpen(false);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : `Select ${title}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
            <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
