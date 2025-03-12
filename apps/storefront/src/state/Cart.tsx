import { getLocalCart, writeLocalCart } from '@/lib/cart'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext({
  cart: null,
  crossSellProducts: [],
  loading: true,
  refreshCrossSellProducts: () => {},
  dispatchCart: (object) => {},
})

export const useCartContext = () => {
  return useContext(CartContext)
}

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [crossSellProducts, setCrossSellProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const dispatchCart = async (cart) => {
    setCart(cart)
    writeLocalCart(cart)
  }

  const fetchCart = async () => {
    const response = await fetch('/api/cart')
    const cart = await response.json()
    setCart(cart)
  }

  const refreshCrossSellProducts = async () => {
    const response = await fetch('/api/cart/cross-sell')
    const crossSellProducts = await response.json()
    setCrossSellProducts(crossSellProducts)
  }

  useEffect(() => {
    fetchCart()
    refreshCrossSellProducts()
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        crossSellProducts,
        loading,
        refreshCrossSellProducts,
        dispatchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
