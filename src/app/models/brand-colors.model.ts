export interface BrandColors {
  primary: string
  secondary: string
  accent: string
}

export type BrandColorRole = "none" | "primary" | "secondary" | "accent"

export interface BrandColorChangeEvent {
  color: string
  role: BrandColorRole
}

export const DEFAULT_BRAND_COLORS: BrandColors = {
  primary: "#74d94fff",
  secondary: "#3f4652ff",
  accent: "#30343aff"
}
