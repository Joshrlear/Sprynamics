import { User } from "#models/user.interface";
import { BrandColors } from "#app/shared/colors/brand-colors.interface";

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