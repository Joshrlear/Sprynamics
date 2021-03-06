import { AuthService } from '#core/auth.service'
import { GoogleMapsService } from '#core/gmaps.service'
import { MlsService } from '#core/mls.service'
import { User } from '#models/user.model'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material'

declare const google
declare const lh

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  @Input() selectedListing: any
  @Input() listingId: any
  @Output() changeProperty = new EventEmitter()

  _agent: User

  selectedIndex: number
  listings: any[]

  loading: boolean

  autocomplete: any

  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private mls: MlsService,
    private fb: FormBuilder,
    private gmaps: GoogleMapsService
  ) {}

  @Input('agent')
  set agent(agent: User) {
    this._agent = agent
    console.log(agent)
    if (agent) {
      this.loading = true
      this.mls.getListings(agent.licenseId).then(listings => {
        this.listings = listings
        lh(
          'submit',
          'SEARCH_DISPLAY',
          this.listings.map(l => ({ lkey: l.listingKey }))
        )
        if (this.listingId) {
          this.selectedListing = this.listings.find(listing => {
            return listing.id === this.listingId
          })
          this.onChangeAddress()
        } else {
          this.selectedListing = this.listings[0]
          this.onChangeAddress()
        }
        this.loading = false
      })
    }
  }

  ngOnInit() {
    this.listings = []
  }

  updatePropertyInfo() {
    this.onChangeAddress()
  }

  async onChangeAddress() {
    const listing = this.selectedListing
    lh('submit', 'DETAIL_PAGE_VIEWED', { lkey: listing.listingKey })
    // geocode the address and emit it
    const res = await this.gmaps.geocodeAddress(
      listing.fullStreetAddress,
      listing.postalCode,
      null,
      listing.stateOrProvince
    )
    const location = res.results[0].geometry.location
    const addressObj = {
      listing,
      location,
      formatted_address: `${listing.fullStreetAddress}, ${listing.city}, ${
        listing.stateOrProvince
      } ${listing.postalCode}`
    }
    this.changeProperty.emit(addressObj)
  }
}
