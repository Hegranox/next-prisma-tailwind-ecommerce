import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

type OrderSummary = {
  date: string
  total: number
}

interface OrderSummaryProps {
  data: OrderSummary[]
}

export default function OrderSummary({ data }: OrderSummaryProps) {
  const columns: ColumnDef<OrderSummary>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'total',
      header: 'Total',
    },
  ]

  return (
    <div>
      <DataTable searchKey="title" columns={columns} data={data} />
    </div>
  )
}
