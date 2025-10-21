import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Check, X } from "lucide-react"

export type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
  placeholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select options...",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option))
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-h-[40px] h-auto relative w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 && placeholder}
            {selected.map((option) => (
              <Badge
                key={option}
                variant="secondary"
                className="mr-1 mb-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUnselect(option)
                }}
              >
                {options.find((o) => o.value === option)?.label || option}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 px-1 ml-1 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(option)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {option}</span>
                </Button>
              </Badge>
            ))}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search options..." className="h-9" />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(
                    selected.includes(option.value)
                      ? selected.filter((s) => s !== option.value)
                      : [...selected, option.value]
                  )
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}