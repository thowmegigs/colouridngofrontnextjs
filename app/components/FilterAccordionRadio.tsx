import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface FilterOption {
  id: string;
  name: string;
  image?: string; // Optional image support
}

interface Props {
  /**
   * A unique value that identifies the accordion section.
   * It should match the parent list item key (e.g., "discount", "ratings").
   */
  value: string;

  /**
   * The human‑readable heading shown in the accordion trigger.
   */
  title: string;

  /**
   * The set of selectable filter options.
   */
  options: FilterOption[];

  /**
   * The current selection supplied from outside (useful when restoring state from URL params).
   */
  selectedFilterParams: FilterOption[] | undefined;

  /**
   * Fires whenever the user changes the selection.
   */
  onChange: (selected: FilterOption | null) => void;

  /**
   * Whether to display the inline search box above the list.
   * Defaults to `true`.
   */
  showSearch?: boolean;
}

/**
 * An accordion item that renders its options as a **single‑select** radio group.
 * Use it for filters such as discount ranges or star ratings where only
 * one choice should be active at a time.
 */
const FilterAccordionItemRadio: React.FC<Props> = ({
  value,
  title,
  options,
  onChange,
  selectedFilterParams,
  showSearch = true,
}) => {
  // ——————————————————————————————————————————
  // Local state
  // ——————————————————————————————————————————

  const [search, setSearch] = useState("");
  const [acValue, setAcValue] = useState(value);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Sync external selection into internal state (e.g., when parsing URL params)
  useEffect(() => {
    if (selectedFilterParams && selectedFilterParams.length > 0) {
      setSelectedId(selectedFilterParams[0]?.id);
    } else {
      setSelectedId(undefined);
    }
  }, [selectedFilterParams]);

  // ——————————————————————————————————————————
  // Derived data
  // ——————————————————————————————————————————

  const filteredOptions = useMemo(() => {
    if (search.trim().length === 0) return options;
    return options.filter((opt) =>
      String(opt.name).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  // ——————————————————————————————————————————
  // Handlers
  // ——————————————————————————————————————————

  const handleChange = useCallback(
    (id: string) => {
      const selectedItem = options.find((o) => o.id === id) || null;
      setSelectedId(id);
      onChange(selectedItem);
    },
    [options, onChange]
  );

  // ——————————————————————————————————————————
  // Render
  // ——————————————————————————————————————————

  return (
    <Accordion
      type="single"
      collapsible
      value={acValue}
      onValueChange={(val) => setAcValue(val === acValue ? "" : val)}
    >
      <AccordionItem value={value}>
        <AccordionTrigger className="py-2 text-sm">{title}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {showSearch && (
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
            )}

            <RadioGroup
              value={selectedId}
              onValueChange={handleChange}
              className="space-y-2"
            >
              {filteredOptions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <RadioGroupItem value={item.id} id={`${value}-${item.id}`} />

                  {/* ————————————————————————————
                      Label variations
                  ———————————————————————————— */}
                  {value !== "ratings" ? (
                    value !== "colors" ? (
                      <Label
                        htmlFor={`${value}-${item.id}`}
                        className="font-normal text-xs cursor-pointer"
                      >
                        {item.name}
                      </Label>
                    ) : (
                      <Label
                        htmlFor={`${value}-${item.id}`}
                        className="font-normal text-xs cursor-pointer flex items-center space-x-2"
                      >
                        <div
                          className={`w-4 h-4 bg-${item.name.toLowerCase()}-500 rounded-full`}
                        />
                        <span>{item.name}</span>
                      </Label>
                    )
                  ) : (
                    <Label
                      htmlFor={`${value}-${item.id}`}
                      className="font-normal text-xs cursor-pointer flex items-center"
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Number(item.id)
                              ? "text-amber-500 fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="ml-1">& Up</span>
                    </Label>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterAccordionItemRadio;
