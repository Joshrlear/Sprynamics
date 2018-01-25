import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { StorageService } from '../../core/storage.service';
import { LoadTemplateDialogComponent } from '../load-template-dialog/load-template-dialog.component';
import { productTypes, productSpecs } from '../products';
import { ObjectFactoryService } from '../object-factory.service';

import 'webfontloader';
declare let WebFont;

import 'fabric';
declare let fabric;

@Component({
  selector: 'app-designer',
  templateUrl: './designer-admin.component.html',
  styleUrls: ['./designer-admin.component.css']
})
export class DesignerAdminComponent implements OnInit, AfterViewInit {

  @ViewChild('designerView') view: ElementRef;

  productTypes = productTypes;

  defaultTemplate = {
    name: '',
    productType: this.productTypes.postcard_small,
    presetColors: [],
    front: null,
    back: null
  }

  template: any = Object.assign({}, this.defaultTemplate);

  canvas;
  background: any;
  safeArea: any;
  printArea: any;

  viewSide: 'front' | 'back' = 'front';

  userData: any;

  loadingFonts: boolean;
  fonts: string[];

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
    private dialog: MatDialog,
    private http: Http,
    private route: ActivatedRoute,
    public factory: ObjectFactoryService
  ) { }

  ngOnInit() {
    this.loadingFonts = true;
    this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyA-kEmBuQZhfrdS1Rije3syG3tCu8OGVcM')
      .take(1).subscribe(res => {
        this.fonts = res.json().items.map(font => font.family).slice(0, 200);
        // console.log(this.fonts);
        WebFont.load({
          google: {
            families: this.fonts
          },
          active: () => {
            this.loadingFonts = false;
          }
        });
      });

    // Get user data
    this.auth.user.take(1).subscribe((user: any) => {
      this.userData = user;
      this.template.presetColors = user.presetColors || [];
    });

    // Load product type from query parameter
    this.route.queryParamMap.take(1).subscribe((queryParamMap: any) => {
      const product = queryParamMap.params['product'];
      if (product) {
        this.template.productType = this.productTypes[product];
      }
    })
  }

  ngAfterViewInit() {
    this.canvas = fabric.canvas = new fabric.Canvas('canvas', {
      width: this.view.nativeElement.clientWidth,
      height: this.view.nativeElement.clientHeight,
      preserveObjectStacking: true,
      backgroundColor: '#fff'
    });

    fabric.Object.prototype.set({
      borderColor: '#12C463',
      cornerColor: 'white',
      cornerStrokeColor: 'black',
      cornerSize: 10,
      transparentCorners: false
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

    // Fix rectangle scaling
    this.canvas.on('object:modified', (event) => {
      if (event.target.type === 'rect') {
        event.target.width *= event.target.scaleX;
        event.target.height *= event.target.scaleY;
        event.target.scaleX = 1;
        event.target.scaleY = 1;
        this.forceRender(event.target);
      }
    });

    // Auto-align object when dragged
    this.canvas.on("object:moving", (event) => {
      if (event.e.ctrlKey) {
        // ignore alignment when the ctrl key is held down
        return;
      }
      const target = event.target;

      this.canvas.forEachObject(obj => {
        if (obj.isBoundBox || (obj.id !== target.id && !obj.isBackground)) {
          const bound = obj;
          target.right = target.left + target.getWidth();
          target.bottom = target.top + target.getHeight();
          bound.right = bound.left + bound.width;
          bound.bottom = bound.top + bound.height;
          // top/top alignment
          if (target.top > bound.top - 10 && target.top < bound.top + 10) {
            target.setTop(bound.top);
          }
          // top/bottom alignment
          if (target.top > bound.bottom - 10 && target.top < bound.bottom + 10) {
            target.setTop(bound.bottom);
          }
          // left/left alignment
          if (target.left > bound.left - 10 && target.left < bound.left + 10) {
            target.setLeft(bound.left);
          }
          // left/right alignment
          if (target.left > bound.right - 10 && target.left < bound.right + 10) {
            target.setLeft(bound.right);
          }
          // right/right alignment
          if (target.right > bound.right - 10 && target.right < bound.right + 10) {
            target.left = bound.right - target.getWidth();
          }
          // right/left alignment
          if (target.right > bound.left - 10 && target.right < bound.left + 10) {
            target.left = bound.left - target.getWidth();
          }
          // bottom/bottom alignment
          if (target.bottom > bound.bottom - 10 && target.bottom < bound.bottom + 10) {
            target.top = bound.bottom - target.getHeight();
          }
          // bottom/top alignment
          if (target.bottom > bound.top - 10 && target.bottom < bound.top + 10) {
            target.top = bound.top - target.getHeight();
          }
          // center x alignment
          const middleX = target.left + target.getWidth()/2;
          const boundMiddleX = bound.left + bound.width/2;
          if (middleX > boundMiddleX - 10 && middleX < boundMiddleX + 10) {
            target.left = boundMiddleX - target.getWidth()/2;
          }
          // center y alignment
          const middleY = target.top + target.getHeight()/2;
          const boundMiddleY = bound.top + bound.height/2;
          if (middleY > boundMiddleY - 10 && middleY < boundMiddleY + 10) {
            target.top = boundMiddleY - target.getHeight()/2;
          }
        }
      });
      target.setCoords();
    });

    // Auto-align when scaling
    this.canvas.on('object:scaling', (event) => {
      if (event.e.ctrlKey) {
        // ignore alignment when the ctrl key is held down
        return;
      }
      
      const target = event.target;
      const targetBound = target.getBoundingRect();

      this.canvas.forEachObject(obj => {
        if (obj.id !== target.id) {
          const bound = obj.getBoundingRect();

          switch (target.__corner) {
            // top
            case 'mt':
              if (target.top > bound.top - 10 && target.top < bound.top + 10) {
                const h = target.height * target.scaleY;
                target.scaleY = (h - (bound.top - target.top)) / target.height;
                target.top = bound.top;
              }
              break;
            // left
            case 'ml':
              if (target.left > bound.left - 10 && target.left < bound.left + 10) {
                const w = target.width * target.scaleX;
                target.scaleX = (w - (bound.left - target.left)) / target.width;
                target.left = bound.left;
              }
              break;
            // right
            case 'mr':
              const right = target.left + target.getWidth();
              const boundRight = bound.left + bound.width;
              if (right > boundRight - 10 && right < boundRight + 10) {
                target.scaleX = (boundRight - target.left) / target.width;
              }
              break;
            // bottom
            case 'mb':
              const bottom = target.top + target.getHeight();
              const boundBottom = bound.top + bound.width;
              if (bottom > boundBottom - 10 && bottom < boundBottom + 10) {
                target.scaleY = (boundBottom - target.top) / target.height;
              }
              break;
          }
        }
      });
    });

    // initialize the canvas
    this.clearCanvas();
  }

  /**
   * Deletes all content and clears the canvas, then recreates the bounding box.
   */
  clearCanvas() {
    this.canvas.clear();
    const base = this.factory.createProductBase(this.canvas);
    Object.assign(this, base);
    this.refreshCanvasSize();
  }

  /** 
   * Refreshes the template size 
   */
  refreshCanvasSize() {
    const productType = this.template.productType;
    this.background.set({
      width: productType.width * productSpecs.dpi + productSpecs.bleedInches * productSpecs.dpi,
      height: productType.height * productSpecs.dpi + productSpecs.bleedInches * productSpecs.dpi
    });
    this.safeArea.set({
      width: productType.width * productSpecs.dpi - productSpecs.safeInches * productSpecs.dpi,
      height: productType.height * productSpecs.dpi - productSpecs.safeInches * productSpecs.dpi
    });
    this.printArea.set({
      width: productType.width * productSpecs.dpi,
      height: productType.height * productSpecs.dpi
    });

    console.log(productType.width);
    console.log(productType.height);

    this.canvas.centerObject(this.background);
    this.canvas.centerObject(this.safeArea);
    this.canvas.centerObject(this.printArea);
    this.canvas.renderAll();
  }

  updateViewSide() {
    const lastSide = this.viewSide === 'front' ? 'back' : 'front';
    this.template[lastSide] = this.canvas.toObject();
    this.clearCanvas();
    if (this.template[this.viewSide]) {
      this.canvas.loadFromJSON(this.template[this.viewSide]);
    }
  }

  clickNew() {
    if (confirm('Unsaved changes will be lost. Are you sure you want to start a new template?')) {
      this.template = Object.assign({}, this.defaultTemplate);
      this.clearCanvas();
    } else {
      return;
    }
  }

  clickOpen() {
    const dialogRef = this.dialog.open(LoadTemplateDialogComponent);
    dialogRef.afterClosed().subscribe(id => {
      if (id) {
        this.firestore.doc$(`templates/${id}`)
          .take(1).subscribe(template => this.loadTemplate(template, id));
      }
    });
  }

  clickSave() {
    if (!this.template.name) {
      alert('You need to set a name for this design!');
      return;
    }

    this.template[this.viewSide] = this.canvas.toObject();
    const canvasData = {
      front: this.template.front,
      back: this.template.back
    }

    // add required fonts to template data
    const fonts = [];
    this.canvas.forEachObject((obj: any) => {
      const family = obj.fontFamily;
      if (family && !fonts.includes(family)) {
        fonts.push(family);
      }
    });
    this.template.fonts = fonts;

    if (this.template.id) {
      this.firestore.update(`templates/${this.template.id}`, this.template);
      this.storage.putJSON(canvasData, `templates/${this.template.id}.json`);
    } else {
      this.firestore.add('templates', this.template).then(ref => {
        this.storage.putJSON(canvasData, `templates/${ref.id}.json`)
          .take(1).subscribe(url => {
            this.template.url = url;
            this.firestore.update(`templates/${ref.id}`, { url });
          });
      });
    }
  }

  loadTemplate(template: any, id: string) {
    this.template = template;
    this.template.id = id;
    this.viewSide = 'front';
    this.storage.getFile(template.url).take(1).subscribe(data => {
      console.log(data);
      this.canvas.loadFromJSON(template['front']);
    });
  }

  colorPickerChange(event) {
    if (this.selection.type === 'group') {
      this.selection.forEachObject(obj => {
        if (obj.type === 'i-text') {
          obj.set({ fill: event });
          this.forceRender(obj);
        } else {
          obj.set({ fill: event, backgroundColor: event });
        }
      });
    } else if (this.selection.type === 'rect') {
      this.selection.set({ backgroundColor: event });
    } else if (this.selection.type === 'i-text') {
      this.forceRender(this.selection);
    } else if (this.selection.type === 'path') {
      this.selection.set({ fill: event });
      this.forceRender(this.selection);
    }
    this.canvas.renderAll();
  }

  shadowColorPickerChange(event) {
    // bind the opacity to the color
    this.selection.shadow.opacity = new fabric.Color(this.selection.shadow.color).getAlpha();
    this.canvas.renderAll();
  }

  forceRender(obj) {
    // this is a bit of a hack to get the canvas to update the text color.
    // the width is increased then decreased to force the cache to clear.
    obj.set({ width: obj.width + 1 });
    obj.set({ width: obj.width - 1 });
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

  bringForward() {
    fabric.canvas.bringForward(this.selection, false);
  }
  sendBackward() {
    this.canvas.sendBackward(this.selection, false);
  }
  bringToFront() {
    this.canvas.bringToFront(this.selection);
  }
  sendToBack() {
    this.canvas.sendToBack(this.selection);
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

  changeLogoType() {
    let src;
    switch (this.selection.logoType) {
      case 'headshot':
        src = this.userData.avatarUrl;
        break;
      case 'brokerage':
        src = this.userData.brokerageLogoUrl;
        break;
      case 'company':
        src = this.userData.companyLogoUrl;
        break;
      default:
        src = '/assets/logo.png';
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      this.selection.setElement(img);
      this.forceRender(this.selection);
    }
    img.src = src;
  }

  addImageFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = event.target.result;
        img.onload = () => {
          const image = new fabric.Image(img);
          this.factory.addObject(image, this.canvas);
        }
      }
      reader.readAsDataURL(file);
    }
  }
}
