import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CropDialogComponent } from '../../crop-dialog/crop-dialog.component';

declare let google;

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {

  @Input('photos') photos: any[]; 
  @Output('photoChange') changeEvent = new EventEmitter();
  @Output('addressChange') addressChangeEvent = new EventEmitter();

  selectedIndex: number;

  autocomplete;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('propertyAddressInput')),
      {types: ['geocode']}
    );
    this.autocomplete.addListener('place_changed', this.onChangeAddress.bind(this));
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
    this.addressChangeEvent.emit(this.autocomplete.getPlace());
  }

}
