import { BrandColors } from "#models/brand-colors.model"

export interface User {
  uid: string
  email: string
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  website: string
  company: string
  licenseId: string
  avatarUrl: string
  companyLogoUrl: string
  brokerageLogoUrl: string
  admin: boolean
  braintreeId?: string
  currentOrder?: {
    frontUrl?: string
    backUrl?: string
    pdfUrl?: string
  }
  brandColors?: BrandColors
}
