import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { first } from 'rxjs/operators'

@Injectable()
export class GoogleMapsService {
  private API_KEY: string
  API_URL: string

  constructor(private http: HttpClient) {
    this.API_KEY = 'AIzaSyCZVNyrdx6wsVpCCnVuvawW2ZlhTDaRg9s'
    this.API_URL = `https://maps.googleapis.com/maps/api`
  }

  public geocodeAddress(
    address: string,
    postalCode?: string,
    place?: string,
    province?: string,
    region?: string,
    country?: string
  ): Promise<any> {
    let compositeAddress = [address]

    if (postalCode) compositeAddress.push(postalCode)
    if (place) compositeAddress.push(place)
    if (province) compositeAddress.push(province)
    if (region) compositeAddress.push(region)
    if (country) compositeAddress.push(country)

    let url = `${this.API_URL}/geocode/json?key=${this.API_KEY}&address=${compositeAddress.join(',')}`

    return this.http
      .get(url)
      .pipe(first())
      .toPromise()
  }

  public getStaticMapUrl(latitude: number, longitude: number, zoom = 12, width = 400, height = 400) {
    return (
      `${this.API_URL}/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&key=${this.API_KEY}` +
      `&markers=${latitude},${longitude}`
    )
  }
}
