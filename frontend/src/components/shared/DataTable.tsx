import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  getRowKey: (item: T) => string | number;
  selectedKey?: string | number | null;
  emptyMessage?: string;
  rowClassName?: (item: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  getRowKey,
  selectedKey,
  emptyMessage = "No data available",
  rowClassName,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 border-b border-gray-200">
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={column.headerClassName || "px-4 py-3"}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center py-8 text-gray-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            const key = getRowKey(item);
            const isSelected = selectedKey === key;
            const baseClassName = `cursor-pointer transition-colors border-b border-gray-200 ${
              isSelected ? "bg-gray-50" : "bg-white hover:bg-gray-50"
            }`;
            const finalClassName = rowClassName
              ? `${baseClassName} ${rowClassName(item)}`
              : baseClassName;

            return (
              <TableRow
                key={key}
                className={finalClassName}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={column.className || "px-4 py-4"}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
