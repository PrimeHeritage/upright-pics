import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
} from '@tanstack/react-table'

import { StatusPill } from './status'
import { BUSINESS_TIME_ZONE } from '@/lib/utils'
import type { Inquiry } from '@/types'

export const inquiryFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
  filterFns: { includesString: filterFn_includesString, equalsString: filterFn_equalsString },
})

const col = createColumnHelper<typeof inquiryFeatures, Inquiry>()

const dateFmt = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: BUSINESS_TIME_ZONE })
const timeFmt = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: BUSINESS_TIME_ZONE,
})

export const formatEventDate = (iso: string | null | undefined) => (iso ? dateFmt.format(new Date(iso)) : null)
export const formatReceived = (iso: string) => timeFmt.format(new Date(iso))

export const inquiryColumns = col.columns([
  col.accessor('name', {
    header: 'From',
    sortFn: 'alphanumeric',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className={row.original.status === 'new' ? 'truncate font-semibold' : 'truncate'}>{row.original.name}</p>
        <p className="truncate text-xs text-ash">
          {row.original.phone}
          {row.original.service ? <span className="xl:hidden"> · {row.original.service}</span> : null}
        </p>
      </div>
    ),
  }),
  col.accessor((r) => r.service ?? '', {
    id: 'service',
    header: 'Service',
    sortFn: 'alphanumeric',
    cell: ({ getValue }) => <span className="text-paper/85">{getValue() || 'Not specified'}</span>,
  }),
  col.accessor((r) => r.eventDate ?? '', {
    id: 'eventDate',
    header: 'Date needed',
    sortFn: 'alphanumeric',
    cell: ({ row }) => <span className="text-paper/85">{formatEventDate(row.original.eventDate) ?? 'Flexible'}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    filterFn: 'equalsString',
    enableGlobalFilter: false,
    cell: ({ getValue }) => <StatusPill status={getValue()} />,
  }),
  col.accessor((r) => new Date(r.createdAt), {
    id: 'createdAt',
    header: 'Received',
    sortFn: 'datetime',
    enableGlobalFilter: false,
    cell: ({ row }) => <span className="whitespace-nowrap text-ash">{formatReceived(row.original.createdAt)}</span>,
  }),
  // Hidden column that feeds the search box (message, email and location are not shown as columns).
  col.accessor((r) => [r.name, r.phone, r.email, r.location, r.message, r.service].filter(Boolean).join(' '), {
    id: 'search',
    filterFn: 'includesString',
  }),
])
