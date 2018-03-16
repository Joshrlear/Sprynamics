import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CropDialogComponent } from '../../crop-dialog/crop-dialog.component';
import { AuthService } from '#core/auth.service';
import { SlipstreamService } from '#core/slipstream.service';

declare let google;

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {

  @Input('agent') agent: any;
  @Input('photos') photos: any[];
  @Output('photoChange') changeEvent = new EventEmitter();
  @Output('addressChange') addressChangeEvent = new EventEmitter();

  selectedIndex: number;
  selectedListing: any;
  listings: any[];

  loading: boolean;

  autocomplete;

  constructor(private dialog: MatDialog,
    private auth: AuthService,
    private slipstream: SlipstreamService) { }

  ngOnInit() {
    this.loading = true;
    if (this.agent.licenseId) {
      this.slipstream.getSlipstreamToken()
        .then(apiRes => {
          console.log(apiRes.token);
          return this.slipstream.getListings(this.agent.licenseId, apiRes.token);
        })
        .then((data: any) => {
          console.log(data);
          this.listings = data.listings;
          this.selectedListing = data.listings[0];
          this.loading = false;
        });
    } else {
      this.listings = [];
    }
    // this.autocomplete = new google.maps.places.Autocomplete(
    //   (document.getElementById('propertyAddressInput')),
    //   {types: ['geocode']}
    // );
    // this.autocomplete.addListener('place_changed', this.onChangeAddress.bind(this));
  }

  loadImagesFromListing() {
    this.photos.forEach((photo, i) => {
      this.changeEvent.emit({
        index: i,
        photo: this.selectedListing.images[i]
      })
    })
  }

  uploadImage(file: File) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.openDialog(reader.result)
    });
    reader.readAsDataURL(file);
  }

  openDialog(dataURL) {
    const obj = this.photos[this.selectedIndex];
    console.log(obj);
    const dialogRef = this.dialog.open(CropDialogComponent, {
      data: {
        url: dataURL,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY
      }
    });

    dialogRef.afterClosed().take(1).subscribe((data) => {
      if (data) {
        this.changeEvent.emit({
          index: this.selectedIndex,
          photo: data
        });
      }
    });
  }

  onChangeAddress() {
    const addr = this.selectedListing.address;
    const addressObj = {
      address: addr,
      formatted_address: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`
    }
    this.addressChangeEvent.emit(addressObj);
  }

}
