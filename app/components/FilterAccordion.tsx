import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface FilterOption {
  id: string;
  name: string;
  image?: string; // Optional image support
}

interface Props {
  value: string;
  title: string;
  options: FilterOption[];
selectedFilterParams:any,
  onChange: (selected: any) => void;
  showSearch?: boolean;
}

const FilterAccordionItem: React.FC<Props> = ({
  value,
  title,
  options,
  onChange,
  selectedFilterParams,
  showSearch = true,
}) => {

  const [search, setSearch] = useState("");
  const [acvalue, setAcValue] = useState(value);
  const [selected, setSelected] = useState<any>([]);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  useEffect(()=>{
    const ids=selectedFilterParams?selectedFilterParams.map((v)=>(v.id)):[]
    setSelectedIds([...ids])
  },[selectedFilterParams])
  const filteredOptions = useMemo(() => {
    return search.length > 0 ? options.filter((opt) => {
      let name: any = opt.name;
      return typeof name === 'string' ? name.toLowerCase().includes(search.toLowerCase())
        : name == search
    }
    ) : options;
  }, [search, options]);
  const handleChange = useCallback((checked: boolean, item: any) => {
 
    if (checked) {
      selected.push(item)
      setSelected([...selected])

      setSelectedIds([...selectedIds, item.id])
       onChange([...selected])
    }
    else {
      const filteredArray = selected.filter((obj: any) => obj.id !== item.id);
      setSelected([...filteredArray])
       onChange([...filteredArray])
      const filteredArray1 = selectedIds.filter((i: any) => i !== item.id);
      setSelectedIds([...filteredArray1])
    }
   
  },[selected,selectedIds])
console.log('slected ids ',selectedIds)
  return (
    <Accordion
      type="single"
      collapsible
      value={acvalue}
      onValueChange={(val: any) => setAcValue(val === acvalue ? '' : val)}
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
            {filteredOptions && Array.isArray(filteredOptions) && 
            filteredOptions.map((item, index) => {
              
              return <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={(checked: boolean) => handleChange(checked, item)}
                />
                {value !== 'ratings' ?(value!=='colors'?
                  <Label htmlFor={item.id} className="font-normal text-xs cursor-pointer">
                    {item.name}
                  </Label>:
                       <Label htmlFor={item.id} className="font-normal text-xs cursor-pointer flex items-center space-x-2 ">
                      <div className={`w-4 h-4 bg-${item.name.toLowerCase()}-500 rounded-full`}></div>
                            <span className="peer-checked:font-semibold">{item.name}</span>
                          
                     </Label>
                    )
                  : <Label htmlFor={`rating-${item.id}`} className="font-normal text-xs cursor-pointer flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Number(item.id) ? "text-amber-500 fill-current" : "text-muted-foreground"}`}
                      />
                    ))}
                    <span className="ml-1">& Up</span>
                  </Label>
                }
              </div>
})}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterAccordionItem;
