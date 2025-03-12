import { Product as CrossSellProduct } from '@/components/native/Product'
import { Card, CardContent } from '@/components/ui/card'
import { isVariableValid } from '@/lib/utils'
import { useCartContext } from '@/state/Cart'

import { Item } from './item'
import { Receipt } from './receipt'
import { Skeleton } from './skeleton'

export const CartGrid = () => {
  const { cart, crossSellProducts } = useCartContext()

  if (
    !isVariableValid(cart) ||
    (isVariableValid(cart?.items) && cart?.items?.length === 0)
  ) {
    return (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <p>Your Cart is empty...</p>
            </CardContent>
          </Card>
        </div>
        <Receipt />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          {isVariableValid(cart?.items)
            ? cart?.items?.map((cartItem, index) => (
                <Item cartItem={cartItem} key={index} />
              ))
            : [...Array(5)].map((cartItem, index) => <Skeleton key={index} />)}
        </div>
        <Receipt />
      </div>

      {crossSellProducts.length ? (
        <div className="mt-5">
          <h3 className="mb-4 text-xl font-medium">You might also like</h3>
          <div className="flex gap-2 overflow-x-auto">
            {crossSellProducts.map((product) => (
              <div key={product.id} className="min-w-80">
                <CrossSellProduct product={product} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
