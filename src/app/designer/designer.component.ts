import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FirestoreService } from '../core/firestore.service';
import 'fabric';
declare let fabric;

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit, AfterViewInit {

  @ViewChild('designerView') view: ElementRef;

  canvas;
  boundBox;
  shape;

  userData: any;

  get selection() {
    if (this.canvas) {
      // console.log(this.canvas.getActiveObject());
      return this.canvas.getActiveGroup() || this.canvas.getActiveObject() || null;
    } else {
      return null;
    }
  }

  constructor(private element: ElementRef, private firestore: FirestoreService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe(user => {
      this.userData = user;
    })
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: this.view.nativeElement.clientWidth,
      height: this.view.nativeElement.clientHeight
    });

    this.boundBox = new fabric.Rect({
      width: 912,
      height: 586,
      fill: 'transparent',
      stroke: '#777',
      strokeDashArray: [5, 5],
      selectable: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true
    });

    this.canvas.add(this.boundBox);

    this.canvas.centerObject(this.boundBox);
  }

  logSelection() {
    console.log(this.selection);
  }

  deleteSelection() {
    if (this.selection) {
      if (this.selection.type === 'group') {
        this.selection.forEachObject(obj => this.canvas.remove(obj));
        this.canvas
          .discardActiveGroup()
          .renderAll();
      } else {
        this.selection.remove();
      }
    }
  }

  changeUserData() {
    if (this.userData) {
      let dataName = this.selection.textUserData;
      let dataText;

      if (dataName === 'name') {
        dataText = `${this.userData['firstName']} ${this.userData['lastName']}`;
      } else if (dataName === 'address') {
        dataText = `${this.userData['address1']} ${this.userData['address2']}\n` +
                   `${this.userData['city']}, ${this.userData['state']}`;
      } else {
        dataText = this.userData[dataName];
      }

      this.selection.set({ text: dataText });
      this.canvas.renderAll();
    }
  }

  keyPressed(event) {
    if (event.keyCode === 8) {
      this.deleteSelection();
    }
  }

  clickTextInput(textInput) {
    if (textInput.value === 'Type text here...') {
      textInput.value = '';
    }
  }

  blurTextInput(textInput) {
    if (textInput.value === '') {
      textInput.value = 'Type text here...';
    }
  }

  toggleBold() {
    if (this.selection.fontWeight === 'normal') {
      this.selection.fontWeight = 'bold';
    } else {
      this.selection.fontWeight = 'normal';
    }
    this.canvas.renderAll();
  }

  toggleItalics() {
    if (this.selection.fontStyle === 'italic') {
      this.selection.fontStyle = 'normal';
    } else {
      this.selection.fontStyle = 'italic';
    }
    this.canvas.renderAll();
  }

  toggleUnderline() {
    this.selection.underline = !this.selection.underline;
    this.canvas.renderAll();
  }

  addText() {
    const textbox = new fabric.IText('Type text here...', {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
      hasRotatingPoint: false,
      textContentType: 'plain',
      userEditable: false
    });

    this.canvas.add(textbox).setActiveObject(textbox);
  }

  addShape() {
    const shape = new fabric.Rect({
      width: 200,
      height: 200,
      fill: '#00e676',
      hasRotatingPoint: false
    });

    this.canvas.add(shape).setActiveObject(shape);
  }

  addLogo() {
    const logo = new fabric.Image.fromURL('/assets/logo.png', 
      (img) => {
        img.scaleToHeight(100);
        img.type = 'logo';
        this.canvas.add(img);
      });
  }

  addImageFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const image = new fabric.Image(img);
          image.set({
            angle: 0,
            // height: 120,
            // width: 120
          });
          this.canvas
            .add(image)
            .renderAll();
        }
      }
      reader.readAsDataURL(file);
    }
  }

}
