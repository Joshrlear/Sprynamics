import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService } from '../core/auth.service';
import { FirestoreService } from '../core/firestore.service';
import { StorageService } from '../core/storage.service';

import 'fabric';
import { LoadTemplateDialogComponent } from './load-template-dialog/load-template-dialog.component';
declare let fabric;

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit, AfterViewInit {

  @ViewChild('designerView') view: ElementRef;

  productTypes = {
    postcard_small: {
      type: 'postcard',
      width: 9,
      height: 6
    },
    postcard_large: {
      type: 'postcard',
      width: 11.5,
      height: 6
    },
    flyer_portrait: {
      type: 'flyer',
      width: 8.5,
      height: 11
    },
    flyer_landscape: {
      type: 'flyer',
      width: 11,
      height: 8.5
    },
    door_hanger: {
      type: 'doorhanger',
      width: 3.5,
      height: 8.5
    }
  };

  defaultTemplate = {
    name: '',
    productType: this.productTypes.postcard_small,
    presetColors: []
  }

  template: any = Object.assign({}, this.defaultTemplate);

  defaultShadow = {
    color: 'rgba(0,0,0,0)',
    blur: 20,    
    offsetX: 10,
    offsetY: 10,
    opacity: 0.6
  }

  canvas;
  boundBox;
  shape;
  dpi = 72; // the dpi to display the template at

  userData: any;

  get selection() {
    if (this.canvas) {
      // console.log(this.canvas.getActiveObject());
      return this.canvas.getActiveGroup() || this.canvas.getActiveObject() || null;
    } else {
      return null;
    }
  }

  constructor(private element: ElementRef, 
    private firestore: FirestoreService,
    private storage: StorageService, 
    private auth: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe((user: any) => {
      this.userData = user;
      this.template.presetColors = user.presetColors || [];
    });

    // returns true if the Object has a shadow, or false if not.
    // Also accepts a parameter to set the shadow
    Object.defineProperty(fabric.Object.prototype, 'spryShadow', {
      get: function spryShadow() {
        return new fabric.Color(this.shadow.color).getAlpha() > 0;
      },
      set: function spryShadow(val) {
        if (typeof val === 'boolean') {
          const color = new fabric.Color(this.shadow.color);
          let alpha;
          if (val) alpha = this.shadow.opacity;
          else alpha = 0;
          color.setAlpha(alpha);
          this.shadow.color = color.toRgba();
          fabric.canvas.renderAll();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.canvas = fabric.canvas = new fabric.Canvas('canvas', {
      width: this.view.nativeElement.clientWidth,
      height: this.view.nativeElement.clientHeight
    });

    this.clearTemplate();
  }

  cloneSelection() {
    const object = this.canvas.getActiveObject().toObject();
    fabric.util.enlivenObjects([object], (objects) => {
      objects.forEach(object => {
        object.set("top", object.top+5);
        object.set("left", object.left+5);
        object.setShadow(this.defaultShadow);
        this.canvas.add(object);
        this.canvas.setActiveObject(object);
      });
      this.canvas.renderAll();
    });
    
  }

  /**
   * Deletes all content and clears the canvas, then recreates the bounding box.
   */
  clearTemplate() {
    this.canvas.clear();

    this.boundBox = new fabric.Rect({
      width: 912,
      height: 586,
      fill: 'transparent',
      stroke: '#777',
      strokeDashArray: [5, 5],
      selectable: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });

    this.boundBox.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          selectable: false,
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
        });
      };
    })(this.boundBox.toObject);

    this.canvas.add(this.boundBox);
    this.canvas.centerObject(this.boundBox);

    this.refreshTemplate();
  }

  clickNew() {
    if (confirm('Unsaved changes will be lost. Are you sure you want to start a new template?')) {
      this.template = Object.assign({}, this.defaultTemplate);
      this.clearTemplate();
    } else {
      return;
    }
  }

  clickOpen() {
    const dialogRef = this.dialog.open(LoadTemplateDialogComponent);
    dialogRef.afterClosed().subscribe(id => {
      if (id) {
        this.firestore.doc$(`templates/${id}`)
          .take(1).subscribe(template => this.loadTemplate(template));
      }
    });
  }

  clickSave() {
    if (!this.template.name) {
      alert('You need to set a name for this design!');
      return;
    }
    const canvasData = this.canvas.toObject();
    this.storage.putJSON(canvasData, `templates/${this.template.name}.json`)
      .take(1).subscribe(url => {
        this.template.url = url;
        this.firestore.add('templates', this.template);
      });
  }

  loadTemplate(template: any) {
    this.template = template;
    this.storage.getFile(template.url).take(1).subscribe(data => {
      console.log(data);
      this.canvas.loadFromJSON(data);
    });
  }

  colorPickerChange(event) {
    if (this.selection.type === 'group') {
      this.selection.forEachObject(obj => {
        if (obj.type === 'i-text') {
          obj.set({ fill: event });
          // this is a bit of a hack to get the canvas to update the text color.
          // the width is increased then decreased to force the cache to clear.
          obj.set({ width: obj.width+1 });
          obj.set({ width: obj.width-1 });
        } else {
          obj.set({ fill: event, backgroundColor: event });
        }
      });
    } else if (this.selection.type === 'rect') {
      this.selection.set({ backgroundColor: event });
    } else if (this.selection.type === 'i-text') {
      // this is a bit of a hack to get the canvas to update the text color.
      // the width is increased then decreased to force the cache to clear.
      this.selection.set({ width: this.selection.width+1 });
      this.selection.set({ width: this.selection.width-1 });
    }
    this.canvas.renderAll();
  }

  shadowColorPickerChange(event) {
    // bind the opacity to the color
    this.selection.shadow.opacity = new fabric.Color(this.selection.shadow.color).getAlpha();
    this.canvas.renderAll();
  }

  /** Refreshes the template size */
  refreshTemplate() {
    // split the product size from the format of 6x9 to a width and height of 6 by 9
    const productType = this.template.productType;
    this.boundBox.set({ 
      width: productType.width * this.dpi,
      height: productType.height * this.dpi
    });
    this.canvas.centerObject(this.boundBox);
    this.canvas.renderAll();
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
      textContentType: 'plain', // custom
      textUserData: 'name', // custom
      userEditable: false // custom
    });
    
    textbox.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          textContentType: this.textContentType,
          textUserData: this.textUserData,
          userEditable: this.userEditable
        });
      };
    })(textbox.toObject);

    textbox.setShadow(this.defaultShadow);
    this.canvas.add(textbox).setActiveObject(textbox);
  }

  addShape() {
    const shape = new fabric.Rect({
      width: 200,
      height: 200,
      fill: '#00e676',
      hasRotatingPoint: false
    });

    shape.setShadow(this.defaultShadow);
    this.canvas.add(shape).setActiveObject(shape);
  }

  addLogo() {
    const logo = new fabric.Image.fromURL('/assets/logo.png', 
      (img) => {
        img.scaleToHeight(100);
        img.isLogo = true;
        img.setShadow(this.defaultShadow);

        img.toObject = (function(toObject) {
          return function() {
            return fabric.util.object.extend(toObject.call(this), {
              isLogo: true
            });
          };
        })(img.toObject);

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
          image.setShadow(this.defaultShadow);
          this.canvas
            .add(image)
            .renderAll();
        }
      }
      reader.readAsDataURL(file);
    }
  }

}
