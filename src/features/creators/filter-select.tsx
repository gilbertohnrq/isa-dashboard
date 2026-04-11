"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0] ?? { value, label: value };

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="creator-filter-field">
      <label className="creator-filter-field__label">{label}</label>
      <div className="creator-filter-select">
        <button
          type="button"
          className={cn("creator-filter-select__trigger", isOpen && "creator-filter-select__trigger--open")}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="truncate">{selectedOption.label}</span>
          <span className={cn("creator-filter-select__chevron", isOpen && "creator-filter-select__chevron--open")}>
            ▾
          </span>
        </button>

        {isOpen ? (
          <div id={listboxId} role="listbox" className="creator-filter-select__menu">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "creator-filter-select__option",
                    isSelected && "creator-filter-select__option--selected",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected ? <span className="creator-filter-select__check">•</span> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
