import { User } from "#models/user.model"
import { BrandColors } from "#models/brand-colors.model"
import { Design } from "#models/design.model"
import { Product } from "#models/product.model"

export interface DesignState {
  agent?: User

  property?: {
    address: string
  }

  brandColors?: BrandColors

  canvasData?: {
    front: any
    back: any
  }

  product?: Product

  design?: Design

  addressObj?: any
  backgroundObj?: any
  boundBoxObj?: any

  textFields?: any[]
  agentFields?: any[]
  propertyFields?: any[]

  propertyImages?: any[]
}
