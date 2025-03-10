import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

type TopSelling = {
  productId: string
  title: string
  total: number
}

interface TopSellingProductsProps {
  data: TopSelling[]
}

export default function TopSellingProducts({ data }: TopSellingProductsProps) {
  const columns: ColumnDef<TopSelling>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
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
