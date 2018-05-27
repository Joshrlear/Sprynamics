import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { MatDialog } from '@angular/material'

import { CropDialogComponent } from '../../crop-dialog/crop-dialog.component'
import { AuthService } from '#core/auth.service'
import { MlsService } from '#core/mls.service'
import { productSpecs } from '#app/designer/products'
import { FormBuilder } from '@angular/forms'
import { GoogleMapsService } from '#core/gmaps.service'
import { first } from 'rxjs/operators'
import { User } from '#models/user.model'

declare const google
declare const lh

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  @Input('listing') selectedListing: any
  @Input('listingId') listingId: any
  @Output('changeProperty') addressChangeEvent = new EventEmitter()

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
    if (agent) {
      this.loading = true
      this.mls.getListings(agent.licenseId).then(listings => {
        this.listings = listings
        lh('submit', 'SEARCH_DISPLAY', this.listings.map(l => ({ lkey: l.listingKey })))
        if (this.listingId) {
          this.selectedListing = this.listings.find(listing => {
            return listing.id === this.listingId
          })
          this.onChangeAddress()
        }
        if (!this.selectedListing) {
          this.selectedListing = this.listings[0]
          this.onChangeAddress()
        }
        this.loading = false
      })
    }
  }

  async ngOnInit() {
    this.listings = []
  }

  updatePropertyInfo() {
    this.onChangeAddress()
  }

  async onChangeAddress() {
    const listing = this.selectedListing
    lh('submit', 'DETAIL_PAGE_VIEWED', { lkey: listing.listingKey })
    // geocode the address and emit it
    const res = await this.gmaps.geocodeAddress(listing.fullStreetAddress, listing.postalCode, null, listing.stateOrProvince)
    const location = res.results[0].geometry.location
    const addressObj = {
      listing,
      location,
      formatted_address: `${listing.fullStreetAddress}, ${listing.city}, ${listing.stateOrProvince} ${listing.postalCode}`
    }
    this.addressChangeEvent.emit(addressObj)
  }
}
