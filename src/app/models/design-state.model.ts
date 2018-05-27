import { User } from "#models/user.model";
import { BrandColors } from "#models/brand-colors.model";

export interface DesignState {

  agent?: User

  property?: {
    address: string,
  }

  brandColors?: BrandColors

  canvasData?: {
    front: any,
    back: any
  }

  addressObj?: any
  backgroundObj?: any
  boundBoxObj?: any

  textFields?: any[]
  agentFields?: any[]
  propertyFields?: any[]
  
  propertyImages?: any[]
}