"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

// Define our own column type since we're not using @tanstack/react-table
export type Column<T> = {
  accessorKey?: string
  id?: string
  header: string
  cell?: (props: { row: T }) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  searchPlaceholder?: string
  searchColumn?: string
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  searchPlaceholder = "Search...",
  searchColumn,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const pageSize = 10

  // Filter data based on search query
  const filteredData = searchColumn && searchQuery
    ? data.filter((item) => {
        const value = (item as any)[searchColumn]
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return false
      })
    : data

  // Calculate pagination
  const pageCount = Math.ceil(filteredData.length / pageSize)
  const startIndex = currentPage * pageSize
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)
  
  const canPreviousPage = currentPage > 0
  const canNextPage = currentPage < pageCount - 1

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-4">
      {searchColumn && (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey || column.id}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={`loading-cell-${i}-${j}`}>
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`${rowIndex}-${colIndex}`}>
                      {column.cell 
                        ? column.cell({ row }) 
                        : column.accessorKey 
                          ? (row as any)[column.accessorKey] 
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {filteredData.length} row(s)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage + 1} of {pageCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!canNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 