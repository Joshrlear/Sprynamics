import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CropDialogComponent } from '../../crop-dialog/crop-dialog.component';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  @Input('photos') photos: any[]; 
  @Output('photoChange') changeEvent = new EventEmitter();

  selectedIndex: number;

  constructor(private dialog: MatDialog) { }

  ngOnInit() { }

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

}
