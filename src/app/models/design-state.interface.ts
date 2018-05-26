import { User } from "#models/user.interface";
import { BrandColors } from "#app/shared/colors/brand-colors.interface";

export interface DesignState {

  agent?: User

  property?: {
    address: string,
  }

  brandColors?: BrandColors

  textFields?: any[]
  agentFields?: any[]

  canvasData?: {
    front: any,
    back: any
  }

  backgroundObj: any
  boundBoxObj: any

}