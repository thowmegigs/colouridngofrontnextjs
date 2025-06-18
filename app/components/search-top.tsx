'use client';

import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';

// Hook: Detects mobile screen size
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}

export default function SearchBar() {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<string[]>([]); // replace with real search result type

  // Simulate instant search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        // Simulate search (replace with API call)
        const mockResults = Array.from({ length: 5 }, (_, i) => `Result ${i + 1} for "${searchQuery}"`);
        setResults(mockResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleFocus = () => {
    if (isMobile) {
      setSheetOpen(true);
    }
  };

  return (
    <>
      {/* Main Search Input (triggers sheet on mobile) */}
      <div className="w-full max-w-md mx-auto px-4 py-2">
        <Input
          placeholder="Search products..."
          onFocus={handleFocus}
          readOnly={isMobile} // Prevent mobile keyboard popup
          className="cursor-pointer"
        />
      </div>

      {/* Sheet Modal for Mobile Search */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="top" className="h-full p-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>

          <div className="mt-4">
            <Input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="mb-4"
            />

            {searchQuery && (
              <p className="text-sm text-muted-foreground mb-2">
                Showing results for: <strong>{searchQuery}</strong>
              </p>
            )}

            <div className="space-y-2">
              {results.length > 0 ? (
                results.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm"
                  >
                    {item}
                  </div>
                ))
              ) : (
                searchQuery && (
                  <p className="text-sm text-muted-foreground">No results found.</p>
                )
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
