import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const FacetFilter = ({ attributes, onFilterChange }:any) => {
  const [activeAttribute, setActiveAttribute] = useState<any>(null);
  const [selectedValues, setSelectedValues] = useState<any>({});

  // Toggle dropdown
  const toggleAttribute = (name:any) => {
    setActiveAttribute(activeAttribute === name ? null : name);
  };

  // Toggle checkbox
  const toggleValue = (attribute:any, value:any) => {
    setSelectedValues((prev:any) => {
      const current = prev[attribute] || [];
      const updated = current.includes(value)
        ? current.filter((v:any) => v !== value)
        : [...current, value];
      return { ...prev, [attribute]: updated };
    });
  };

  // Watch selectedValues and generate query string
  useEffect(() => {
    const queryParts = Object.entries(selectedValues)
      .filter(([_, vals]:any) => vals.length > 0)
      .map(([key, vals]:any) => `${encodeURIComponent(key)}=${vals.map(v => encodeURIComponent(v)).join(',')}`);
    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    onFilterChange(queryString);
  }, [selectedValues, onFilterChange]);

  return (
    <div className="space-y-4">
      {attributes.map((attr:any) => (
        <div key={attr.attribute_name} className="relative">
          <button
            onClick={() => toggleAttribute(attr.name)}
            className="rounded-full border border-gray-300 px-4 py-2 flex items-center justify-between w-full text-sm font-medium bg-white shadow-sm hover:bg-gray-50"
          >
            <span>{attr.name}</span>
            <ChevronDown className={`ml-2 transition-transform ${activeAttribute === attr.attribute_name ? 'rotate-180' : ''}`} size={16} />
          </button>

          {activeAttribute === attr.attribute_ && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full max-h-60 overflow-auto">
              {attr.attribute_values.map((value:any) => (
                <label key={value} className="flex items-center mb-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedValues[attr.name]?.includes(value) || false}
                    onChange={() => toggleValue(attr.name, value)}
                    className="mr-2"
                  />
                  {value}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FacetFilter;
