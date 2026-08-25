"use client";

import React, { useState, useMemo, memo } from "react";
import { ChallengeDataset, DatasetColumn } from "@/lib/formula/types";
import { Search, Hash, Table as TableIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface ExcelGridProps {
  dataset: ChallengeDataset;
  highlightColumnLetter?: string | null;
  highlightRange?: string | null;
  className?: string;
  maxHeight?: string;
  title?: string;
}

const PAGE_SIZE = 30;

// Memoized Table Row Component to eliminate unnecessary re-renders
const TableRow = memo(
  ({
    row,
    rowIdx,
    columns,
    selectedCell,
    highlightColumnLetter,
    onSelectCell,
  }: {
    row: Record<string, any>;
    rowIdx: number;
    columns: DatasetColumn[];
    selectedCell: { col: number; row: number } | null;
    highlightColumnLetter?: string | null;
    onSelectCell: (col: number, row: number) => void;
  }) => {
    const excelRowNum = rowIdx + 2; // Row 1 is header
    const isSelectedRow = selectedCell?.row === excelRowNum;

    return (
      <tr className="hover:bg-surface-secondary/40">
        {/* Row Number (1-based Excel row: 2, 3, 4...) */}
        <td
          className={`sticky left-0 z-10 w-10 min-w-10 px-2 py-1 text-center text-[11px] font-semibold border-r border-b border-border select-none transition-colors ${
            isSelectedRow
              ? "bg-accent/20 text-accent font-bold"
              : "bg-surface-secondary text-foreground-muted"
          }`}
        >
          {excelRowNum}
        </td>

        {/* Data Cells */}
        {columns.map((col, colIdx) => {
          const cellVal = row[col.key];
          const isSelected = selectedCell?.col === colIdx && selectedCell?.row === excelRowNum;
          const isColHighlighted =
            highlightColumnLetter?.toUpperCase() === col.colLetter.toUpperCase();
          const isNumeric =
            typeof cellVal === "number" || (!isNaN(parseFloat(cellVal)) && isFinite(cellVal));

          return (
            <td
              key={col.key || colIdx}
              onClick={() => onSelectCell(colIdx, excelRowNum)}
              className={`excel-cell px-3 py-1 text-xs whitespace-nowrap transition-colors cursor-cell border-r border-b border-border ${
                isSelected
                  ? "outline outline-2 outline-accent bg-accent/10 z-10"
                  : isColHighlighted
                  ? "bg-accent/5 font-medium text-foreground"
                  : "text-foreground"
              } ${isNumeric ? "text-right" : "text-left"}`}
            >
              {typeof cellVal === "number" ? cellVal.toLocaleString() : String(cellVal ?? "")}
            </td>
          );
        })}
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

export const ExcelGrid: React.FC<ExcelGridProps> = ({
  dataset,
  highlightColumnLetter,
  className = "",
  maxHeight = "340px",
  title,
}) => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ col: number; row: number } | null>(null);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return dataset.rows;
    const q = searchQuery.toLowerCase().trim();
    return dataset.rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [dataset.rows, searchQuery]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const displayedRows = useMemo(() => {
    if (filteredRows.length <= PAGE_SIZE) return filteredRows;
    const start = page * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  return (
    <div
      className={`border border-border rounded-lg bg-surface shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {/* Table Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-secondary/60 text-xs text-foreground-secondary">
        <div className="flex items-center gap-2 font-medium">
          <TableIcon className="w-3.5 h-3.5 text-accent" />
          <span>{title || "Dataset"}</span>
          <span className="text-foreground-muted">|</span>
          <span>
            {dataset.rows.length} {t.table.rows} × {dataset.columns.length} {t.table.columns}
          </span>
        </div>

        {/* Quick Search */}
        {dataset.rows.length > 5 && (
          <div className="relative flex items-center">
            <Search className="w-3 h-3 text-foreground-muted absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.table.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="pl-7 pr-2 py-1 text-xs bg-surface border border-border rounded text-foreground focus:outline-none focus:border-accent w-36 sm:w-48 transition-all"
            />
          </div>
        )}
      </div>

      {/* Spreadsheet Container */}
      <div className="overflow-auto relative select-none font-mono text-xs" style={{ maxHeight }}>
        <table className="excel-table w-full border-collapse">
          {/* Header Row (Column Letters: A, B, C...) */}
          <thead>
            <tr className="sticky top-0 z-20">
              {/* Corner Cell */}
              <th className="excel-cell-header sticky left-0 z-30 w-10 min-w-10 px-2 py-1.5 text-center text-[10px] text-foreground-muted bg-surface-tertiary/80 border-r border-b border-border">
                <Hash className="w-3 h-3 mx-auto opacity-50" />
              </th>

              {/* Column Letter Headers */}
              {dataset.columns.map((col, idx) => {
                const isColHighlighted =
                  highlightColumnLetter?.toUpperCase() === col.colLetter.toUpperCase();

                return (
                  <th
                    key={col.key || idx}
                    className={`excel-cell-header px-3 py-1.5 text-center font-bold tracking-wider border-r border-b border-border transition-colors ${
                      isColHighlighted
                        ? "bg-accent/15 text-accent border-b-2 border-b-accent font-black"
                        : "bg-surface-secondary text-foreground-secondary"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xs">{col.colLetter}</span>
                      <span className="text-[10px] font-normal text-foreground-muted truncate max-w-[120px]">
                        {col.name}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body (Data Rows: 2, 3, 4...) */}
          <tbody>
            {displayedRows.map((row, idx) => {
              const actualRowIdx = page * PAGE_SIZE + idx;
              return (
                <TableRow
                  key={actualRowIdx}
                  row={row}
                  rowIdx={actualRowIdx}
                  columns={dataset.columns}
                  selectedCell={selectedCell}
                  highlightColumnLetter={highlightColumnLetter}
                  onSelectCell={(col, row) => setSelectedCell({ col, row })}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info & Pagination for Large Datasets */}
      <div className="px-3 py-1.5 border-t border-border bg-surface-secondary/40 text-[11px] text-foreground-muted flex justify-between items-center">
        <span>
          {t.table.showingRows} {Math.min(filteredRows.length, (page + 1) * PAGE_SIZE)} /{" "}
          {filteredRows.length} {t.table.rows}
        </span>

        {/* Pagination controls if > PAGE_SIZE */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded hover:bg-surface border border-border disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="font-mono text-[10px]">
              {page + 1}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1 rounded hover:bg-surface border border-border disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {selectedCell && (
          <span className="font-mono text-accent font-semibold">
            {dataset.columns[selectedCell.col]?.colLetter}
            {selectedCell.row}
          </span>
        )}
      </div>
    </div>
  );
};
