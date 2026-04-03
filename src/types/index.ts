/** Property type — what kind of real estate */
export type Category =
  | 'appartement'
  | 'villa'
  | 'studio'
  | 'commercial'
  | 'terrain'
  | 'autre'

/** Whether the listing is for sale or rent */
export type TransactionType = 'vente' | 'location'

export type Listing = {
  id: string
  user_id: string
  title: string
  description: string | null
  category: Category
  transaction_type: TransactionType
  price: number | null
  city: string
  neighborhood: string | null
  surface_m2: number | null
  rooms: number | null
  photos: string[]
  status: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  created_at: string
}

export interface SearchFilters {
  city?: string
  category?: Category
  transaction_type?: TransactionType
  minPrice?: number
  maxPrice?: number
  rooms?: number
}
