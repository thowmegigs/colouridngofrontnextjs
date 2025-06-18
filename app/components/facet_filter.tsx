import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FacetFilter = ({
  attributes,
  onFilterChange,
  
}: {
  attributes: any[];
  onFilterChange: (key: string, values: { id: string; name: string }[]) => void;
  selectedParams: Record<string, string[]>; // e.g., { color: ['Red'], fabric: ['Cotton', 'Linen'] }
}) => {
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});

  // Sync local state with global selectedParams


  // Toggle attribute chip
  const toggleAttribute = (key: string) => {
    setSelectedAttributeKey(prev => (prev === key ? null : key));
  };

  // Toggle option checkbox
  const toggleValue = (key: string, value: string) => {
    setSelectedValues(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];

      const formatted = updated.map(v => ({ id: v, name: v }));
      onFilterChange(key, formatted);

      return { ...prev, [key]: updated };
    });
  };

  const selectedAttribute = attributes.find((a: any) => a.key === selectedAttributeKey);

  return (
    <div className="space-y-4">
      {/* Attribute chips */}
      <div className="flex flex-wrap gap-2">
        {attributes.map((attr: any) => (
          <button
            key={attr.key}
            onClick={() => toggleAttribute(attr.key)}
            className={` flex flex-row items-center px-4 py-1 text-sm rounded-full border ${selectedAttributeKey === attr.key
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-primary-100'
              }`}
          >
            {attr.title} <ChevronDown size={16} />
          </button>
        ))}
      </div>

      {/* Checkboxes for the selected attribute */}
      {selectedAttribute && (
        <div className="flex flex-wrap gap-4  rounded-md p-4">
          {selectedAttribute.options.map((option: any) => (
            <label key={option.id} className="flex items-center text-sm space-x-2">
              <input
                type="checkbox"
                checked={selectedValues[selectedAttribute.key]?.includes(option.name) || false}
                onChange={() => toggleValue(selectedAttribute.key, option.name)}
                className="accent-red-800"
              />
              <span>{option.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacetFilter;
