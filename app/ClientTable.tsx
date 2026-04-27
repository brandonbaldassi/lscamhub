// app/ClientTable.tsx
'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';

type Cam = {
  id: string;
  manufacturer: { name: string };
  partNumber: string;
  name: string;
  durationIntake: number;
  durationExhaust: number;
  liftIntake: number;
  liftExhaust: number;
  lsa: number | null;
  powerbandLow: number | null;
  powerbandHigh: number | null;
  recommendedUse: string[];
  headType: string | null;
  idleQuality: string | null;
};

export default function ClientTable({ initialCams }: { initialCams: Cam[] }) {
  const [data] = useState(initialCams);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Cam>[] = [
    { accessorKey: 'manufacturer.name', header: 'Manufacturer' },
    { accessorKey: 'name', header: 'Cam Name' },
    { accessorKey: 'partNumber', header: 'Part #' },
    {
      accessorKey: 'durationIntake',
      header: 'Duration @.050"',
      cell: ({ row }) => `${row.original.durationIntake}/${row.original.durationExhaust}`,
    },
    {
      accessorKey: 'liftIntake',
      header: 'Lift',
      cell: ({ row }) => `${row.original.liftIntake.toFixed(3)}/${row.original.liftExhaust.toFixed(3)}`,
    },
    { accessorKey: 'lsa', header: 'LSA' },
    {
      accessorKey: 'powerbandLow',
      header: 'Powerband',
      cell: ({ row }) => row.original.powerbandLow && row.original.powerbandHigh 
        ? `${row.original.powerbandLow}-${row.original.powerbandHigh} rpm` 
        : '—',
    },
    {
      accessorKey: 'recommendedUse',
      header: 'Application',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.recommendedUse.map((tag) => (
            <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    { accessorKey: 'headType', header: 'Heads' },
    { accessorKey: 'idleQuality', header: 'Idle' },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, globalFilter },
  });

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <input
          placeholder="Search specs or build (e.g. 1000hp turbo, LS3 heads...)"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-zinc-800"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↑')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-900 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 text-sm text-zinc-400">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 rounded-xl"
        >
          ← Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 rounded-xl"
        >
          Next →
        </button>
      </div>
    </>
  );
}