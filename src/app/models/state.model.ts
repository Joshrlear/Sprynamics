import { Product } from "#models/product.model"
import { BrandColors } from "#models/brand-colors.model"
import { Design } from "#models/design.model"
import { User } from "#models/user.model"

export interface ShippingInfo {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
}

export interface Order {
  id?: string
  userId: string
  step: 'designer' | 'checkout'

  // design data
  product: Product
  propertyAddress?: string
  brandColors?: BrandColors
  design?: Design
  pdfUrl?: string
  thumbnail?: string
  propertyImages?: any[]
  canvasData?: {
    front: any
    back: any
  }

  // shipping / mailing
  quantity: number
  shipping?: ShippingInfo
  mailingList?: string

  // data from Braintree
  customerId?: string
  nonce?: string
  token?: string
}

export interface AppState {
  // the currently logged in user
  user: User

  // the user's current order
  order: Order
}
