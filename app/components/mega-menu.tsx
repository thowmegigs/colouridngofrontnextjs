"use client"

import { Category } from "@/interfaces"
import Link from "next/link"
import { useLayoutEffect, useState } from "react"

type MegaMenuProps = {
  categories: Category[]
  slug: string
  onClose: () => void
  className?: string
}

export default function MegaMenu({ categories, slug, onClose, className = "" }: MegaMenuProps) {
  const [balancedColumns, setBalancedColumns] = useState<any[]>([])
const [width,setWidth]=useState<any>(200)
  const menuCategory = categories.find((cat) => cat.slug === slug)

  if (!menuCategory) return null

  const { name, children } = menuCategory

  const maxMenuHeight = 600; // px
  const rowHeight = 40; // px
  const maxRows = Math.floor(maxMenuHeight / rowHeight);
  
let columns = [];
let currentColumn = [];
let currentHeight = 0;
let perColumnWidth=200;
for (const sub of menuCategory.children) {
  const groupHeight = 1 + sub.children.length;

  if (currentHeight + groupHeight > maxRows) {
    columns.push(currentColumn);
    currentColumn = [];
    currentHeight = 0;
  }

  currentColumn.push(sub);
  currentHeight += groupHeight;
}

if (currentColumn.length > 0) {
  columns.push(currentColumn);
}
useLayoutEffect(() => {
  setWidth(perColumnWidth*(columns.length)) // Re-render now that you know the real height
}, [perColumnWidth,columns]);

  return (
    <div 
      className={`absolute  bg-background border-t border-b shadow-lg z-50 ${className}`}
      onMouseLeave={onClose}
      style={{ maxHeight: maxMenuHeight, overflowY: 'auto',left:120,width }} // Fixed height
    >
      <div className="container py-6">
        <div className="grid grid-cols-1">
        
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="menu-column" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div >
                  {column.map((subcat: any, index: number) => (
                   <ul key={index}> 
                    <li key={index}>
                        <Link style={{fontSize:13}}
                          href={`/category/${subcat.slug}`}
                          className="text-sm hover:text-primary"
                          onClick={onClose}
                        >
                        <span className="text-primary"> {subcat.name}</span>
                        </Link>
                        </li>
                      {
                       subcat.children.length>0 && subcat.children.map((child:any)=>{
                       return   <li key={child.id}> <Link
                          href={`/category/${child.slug}`}
                          className="text-sm hover:text-primary space-y-1"
                          onClick={onClose} style={{fontSize:13}}
                        >
                         &nbsp; {child.name}
                        </Link> </li>
                        })
                      
                       
                      }
                      </ul>
                   
                  ))}
                </div>
              </div>
            ))}
         
        </div>
      </div>
    </div>
  )
}
