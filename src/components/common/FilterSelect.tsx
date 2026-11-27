import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface FilterSelectOption<T extends string> {
  value: T;
  label: string;
}

interface FilterSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: FilterSelectOption<T>[];
  icon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  compactMobile?: boolean;
}

export function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  icon,
  ariaLabel = 'Filter options',
  className = '',
  compactMobile = false,
}: FilterSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (event.key === 'Enter' && highlightedIndex >= 0) {
        event.preventDefault();
        const option = options[highlightedIndex];
        if (option) {
          onChange(option.value);
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options, onChange]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return next;
    });
  };

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`${
          compactMobile
            ? 'w-auto md:min-w-[168px] gap-1.5 md:gap-2.5 px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-lg md:rounded-xl'
            : 'w-full sm:w-auto min-w-[168px] gap-2.5 px-3.5 py-2 rounded-xl'
        } flex items-center justify-between text-xs font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#113D2E]/25 ${
          isOpen
            ? 'bg-[#F7F5EF] border-[#113D2E]/40 text-[#113D2E] shadow-card'
            : 'bg-[#FFFFFF] hover:bg-[#F7F5EF]/80 border-[#113D2E]/15 hover:border-[#113D2E]/30 text-[#202B27] shadow-subtle'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && <span className="text-[#113D2E]/70 shrink-0">{icon}</span>}
          <span className={`${compactMobile ? 'hidden md:inline ' : ''}truncate`}>{selectedOption?.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#113D2E]/70 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#113D2E]' : ''
          }`}
        />
      </button>

      <div
        role="listbox"
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
        className={`absolute right-0 mt-2 w-full min-w-[188px] p-1.5 rounded-xl bg-[#FFFEFA] border border-[#113D2E]/15 shadow-elevated z-50 origin-top-right transition-all duration-150 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-1 invisible pointer-events-none'
        }`}
      >
        <div className="space-y-0.5">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex && !isSelected;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors duration-150 focus:outline-none ${
                  isSelected
                    ? 'bg-[#113D2E] text-white font-semibold shadow-subtle'
                    : isHighlighted
                    ? 'bg-[#113D2E]/10 text-[#113D2E] font-medium'
                    : 'text-[#202B27] hover:bg-[#113D2E]/10 hover:text-[#113D2E] font-medium'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
