export type SlipstreamAPIToken = { token: string, expires: number }

export type SlipstreamListings = {
  total: number,
  listings: SlipstreamListing[],
  paging: {
    count: number,
    number: number,
    size: number
  }
}

export type SlipstreamListing = {
  address: {
    deliveryLine: string,
    city: string,
    state: string,
    zip: string,
    street: string
  },
  coordinates: {
    latitude: number,
    longitude: number
  },
  geoType: string,
  id: string,
  images: string[],
  listPrice: number,
  listingType: string,
  lotSize: {
    sqft: number,
    acres: number
  },
  market: string,
  propertyType: string,
  source: string,
  status: string,
  systemId: string
}