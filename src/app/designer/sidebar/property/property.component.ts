import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { MatDialog } from '@angular/material'

import { CropDialogComponent } from '../../crop-dialog/crop-dialog.component'
import { AuthService } from '#core/auth.service'
import { MlsService } from '#core/mls.service'
import { productSpecs } from '#app/designer/products';
import { FormBuilder } from '@angular/forms';
import { GoogleMapsService } from '#core/gmaps.service';

declare const google;
declare const lh;

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {

  @Input('agent') agent: any
  @Input('photos') photos: any[]
  @Input('listingId') listingId: any
  @Output('photoChange') changeEvent = new EventEmitter()
  @Output('addressChange') addressChangeEvent = new EventEmitter()

  selectedIndex: number
  @Input('listing') selectedListing: any
  listings: any[]

  loading: boolean;

  autocomplete: any

  constructor(private dialog: MatDialog,
    private auth: AuthService,
    private mls: MlsService,
    private fb: FormBuilder,
    private gmaps: GoogleMapsService) { }

  ngOnInit() {
    this.loading = true
    if (this.agent.licenseId) {
      this.mls.getListings(this.agent.licenseId)
        .take(1)
        .subscribe((listings: any[]) => {
          console.log(listings)
          this.listings = listings
          lh('submit', 'SEARCH_DISPLAY', listings.map(l => { return {lkey: l.listingKey}; }));
          if (this.listingId) {
            this.selectedListing = listings.find((listing) => {
              return listing.id === this.listingId
            });
            this.onChangeAddress();
          }
          if (!this.selectedListing) {
            this.selectedListing = listings[0]
            this.onChangeAddress();
          }
          this.loading = false
        })
    } else {
      this.listings = []
    }
  }

  loadImagesFromListing() {
    // this.photos.forEach((photo, i) => {
    //   if (i < this.selectedListing.photos.length) {
    //     console.log(i)
    //     this.changeEvent.emit({
    //       index: i,
    //       photo: this.selectedListing.photos[i]
    //     })
    //   }
    // });
    this.selectedIndex = 0;
    this.openDialog(this.selectedListing.photos[0])
    // this.changeEvent.emit({
    //   index: 0,
    //   photo: this.selectedListing.photos[0]
    // })
  }

  updatePropertyInfo() {
    this.onChangeAddress()
  }

  uploadImage(file: File) {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      this.openDialog(reader.result)
    })
    reader.readAsDataURL(file)
  }

  openDialog(dataURL) {
    const obj = this.photos[this.selectedIndex]
    obj.width = obj.width * obj.scaleX;
    obj.height = obj.height * obj.scaleY;
    obj.scaleX = obj.scaleY = 1;
    console.log(obj)
    const dialogRef = this.dialog.open(CropDialogComponent, {
      data: {
        url: dataURL,
        width: obj.width * productSpecs.dpi,
        height: obj.height * productSpecs.dpi
      }
    })

    dialogRef.afterClosed().take(1).subscribe((data) => {
      if (data) {
        this.changeEvent.emit({
          index: this.selectedIndex,
          photo: data
        })
      }
    })
  }

  onChangeAddress() {
    const listing = this.selectedListing;
    lh('submit', 'DETAIL_PAGE_VIEWED', { lkey: listing.listingKey });
    // geocode address and emit it
    this.gmaps.geocodeAddress(listing.fullStreetAddress, listing.postalCode, null, listing.stateOrProvince).take(1).subscribe(res => {
      const location = res.results[0].geometry.location;
      const addressObj = {
        listing,
        location,
        formatted_address: `${listing.fullStreetAddress}, ${listing.city}, ${listing.stateOrProvince} ${listing.postalCode}`
      };
      this.addressChangeEvent.emit(addressObj);
    });
  }

}
