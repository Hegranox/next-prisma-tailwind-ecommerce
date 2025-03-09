'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ProductFilterValues = {
  text_search: string
  price_range_min: number
  price_range_max: number
  categories: string
  brand: string
  order_selector: string
}

const formSchema = z
  .object({
    price_range_min: z.number().optional(),
    price_range_max: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.price_range_min && data.price_range_max) {
        return data.price_range_min < data.price_range_max
      }

      return true
    },
    { message: 'Min price should be less than max price' }
  )

const defaultValues: ProductFilterValues = {
  text_search: '',
  price_range_min: 0,
  price_range_max: 0,
  categories: '',
  brand: '',
  order_selector: '',
}

interface ProductFilterProps {
  onSubmit: (values: ProductFilterValues) => void
}

export const ProductFilter = async ({ onSubmit }: ProductFilterProps) => {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const handleSelectCategory = (category: string) => {
    const categories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(categories)
  }

  useEffect(() => {
    const loadBrands = async () => {
      const res = await fetch('/api/brands/list')
      const data = await res.json()
      setBrands(data)
    }

    const loadCategories = async () => {
      const res = await fetch('/api/categories/list')
      const data = await res.json()
      setCategories(data)
    }

    loadBrands()
    loadCategories()
  }, [])

  const handleSubmit = (values: ProductFilterValues) => {
    onSubmit(form.getValues())
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="h-full w-full rounded-md">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="flex justify-between items-center">
              <span className="inline-flex">Filters</span>

              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedCategories([])
                  form.reset()
                  handleSubmit(defaultValues)
                }}
              >
                Clear
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3">
            <CardDescription>
              {/* Text Search Filter */}
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  name="text_search"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Text Search</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Search by name" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border border-gray-200 rounded-md py-2 px-2 ">
                  {/* Slider Price Range Filter */}
                  <FormLabel>Price Range</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="price_range_min"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <Label className="text-xs">Min</Label>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="price_range_max"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <Label>Max</Label>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="border border-gray-200 rounded-md py-2 px-2 flex flex-col gap-4">
                  <FormLabel>Categories</FormLabel>
                  <div className="flex flex-col space-y-2 max-h-72 overflow-y-auto">
                    {categories.map((category) => (
                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={selectedCategories.includes(
                                  category.id
                                )}
                                onCheckedChange={() =>
                                  handleSelectCategory(category.id)
                                }
                              />
                            </FormControl>
                            <Label className="text-md">{category.title}</Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <Select name="brand">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Order Selector */}
                <Select name="order_selector" defaultValue="most_expensive">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Order Selector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most_expensive">
                      Most Expensive Products
                    </SelectItem>
                    <SelectItem value="least_expensive">
                      Cheapest Products
                    </SelectItem>
                    <SelectItem value="title_order_asc">
                      Ascending Order (A-Z)
                    </SelectItem>
                    <SelectItem value="title_order_desc">
                      Descending Order (Z-A)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardDescription>
          </CardContent>

          <CardFooter className="p-3 pt-0">
            <Button className="w-full" type="submit">
              Apply
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
