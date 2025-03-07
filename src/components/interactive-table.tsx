"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface InteractiveTableProps {
  title: string;
  data: any[];
  columns: Column[];
  initialSortColumn?: string;
  initialSortDirection?: "asc" | "desc";
  searchable?: boolean;
  onRowClick?: (row: any) => void;
  pagination?: boolean;
  pageSize?: number;
}

export function InteractiveTable({
  title,
  data,
  columns,
  initialSortColumn,
  initialSortDirection = "asc",
  searchable = true,
  onRowClick,
  pagination = true,
  pageSize = 10,
}: InteractiveTableProps) {
  const [sortColumn, setSortColumn] = useState(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSortDirection
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(lowerSearchTerm)
        )
      );
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [data, searchTerm, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const totalPages = pagination
    ? Math.ceil(filteredData.length / pageSize)
    : 1;

  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {searchable && (
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-8"
              />
              {searchTerm && (
                <X
                  className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className="p-0 h-auto font-medium"
                      >
                        {column.header}
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${
                            sortColumn === column.key
                              ? "opacity-100"
                              : "opacity-50"
                          } ${
                            sortColumn === column.key &&
                            sortDirection === "desc"
                              ? "rotate-180"
                              : ""
                          } transition-all`}
                        />
                      </Button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  >
                    {columns.map((column) => (
                      <TableCell key={`${rowIndex}-${column.key}`}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
