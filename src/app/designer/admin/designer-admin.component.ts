import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { StorageService } from '../../core/storage.service';
import { productTypes, productSpecs, thumbnailSizes } from '#models/product.model';
import { ObjectFactoryService } from '../object-factory.service';
import { AlignmentService } from '#app/designer/admin/alignment.service';
import { CropDialog } from '#shared/crop-dialog/crop.dialog';
import { MatDialog } from '@angular/material';
import { fabricObjectFields } from '#app/designer/fabric-object-fields';
import { AdminDesignerProgressDialog } from '#app/designer/admin/admin-designer-progress-dialog/admin-designer-progress.dialog';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { BrandColorChangeEvent, BrandColorRole, DEFAULT_BRAND_COLORS } from '#models/brand-colors.model';

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

  productTypes = productTypes;
  productSpecs = productSpecs;

  @ViewChild('designerView') view: ElementRef;
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;


  defaultTemplate = {
    name: '',
    productType: this.productTypes.postcard_small,
    brandColors: DEFAULT_BRAND_COLORS,
    front: null,
    back: null
  }

  template: any = Object.assign({}, this.defaultTemplate);

  canvas;
  background: any;
  safeArea: any;
  printArea: any;
  currentTab = 'settings';
  currentTabIndex = 0;
  viewSide: 'front' | 'back' = 'front';

  userData: any;

  loadingFonts: boolean;
  fonts: string[];

  /* Undo history */
  past = [];
  present;
  future = [];
  disableHistory = true;

  /* Allows locking left/top position while dragging an object */
  lockedLeft: number = null;
  lockedTop: number = null;

  get selection() {
    if (this.canvas) {
      return this.canvas.getActiveObject() || this.canvas.getActiveObjects() || null;
    } else {
      return null;
    }
  }

  constructor(private element: ElementRef,
    private firestore: FirestoreService,
    private storage: StorageService,
    private auth: AuthService,
    private http: Http,
    private route: ActivatedRoute,
    public factory: ObjectFactoryService,
    private aligner: AlignmentService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    fabric.Object.prototype.transparentCorners = false;
    this.loadingFonts = true;
    this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyA-kEmBuQZhfrdS1Rije3syG3tCu8OGVcM')
      .take(1).subscribe(res => {
        this.fonts = res.json().items.map(font => font.family).slice(0, 100);
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
    });
  }

  @HostListener('scroll', ['$event'])
  onResize(e?) {

    e.preventDefault();
    console.log(e);
    if (e.originalEvent.wheelDelta / 120 > 0) {
      this.canvas.setZoom(this.canvas.viewport.zoom * 1.1);
    }
    else {
      this.canvas.setZoom(this.canvas.viewport.zoom / 1.1);
    }

    // console.log(event)
    // this.canvas.setWidth(this.view.nativeElement.clientWidth);
    // this.canvas.setHeight(this.view.nativeElement.clientHeight);
    // // this.canvas.calcOffset();
    // const objects = this.canvas.getObjects();
    // const selection = new fabric.ActiveSelection(objects, { canvas: this.canvas });
    // const width = selection.width;
    // const height = selection.height;
    // const scale = this.view.nativeElement.clientHeight / this.canvas.height;
    // console.log(selection.height, this.canvas.height, this.view.nativeElement.clientHeight);
    // // selection.scale(scale);
    // // selection.center();
    // // selection.destroy();
    // // this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), scale);
    // this.canvas.setZoom(scale);
  }

  getCanvasWidth() {
    return this.canvas.width / this.canvas.getZoom();
  }
  getCanvasHeight() {
    return this.canvas.height / this.canvas.getZoom();
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event?) {
  }

  ngAfterViewInit() {
    this.disableHistory = true;
    this.canvas = fabric.canvas = new fabric.Canvas('canvas', {
      width: this.view.nativeElement.clientWidth,
      height: this.view.nativeElement.clientHeight,
      preserveObjectStacking: true,
      backgroundColor: '#fff'
    });

    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), 0.35);

    this.present = this.canvasToJSON();

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
      const obj = event.target;
      if (obj.type === 'rect') {
        obj.width = Math.floor(obj.width * obj.scaleX);
        obj.height = Math.floor(obj.height * obj.scaleY);
        obj.scaleX = 1;
        obj.scaleY = 1;
        this.forceRender(obj);
      } 
      else if (obj.type === 'textbox' || obj.type === 'i-text') {
        obj.fontSize *= obj.scaleX;
        obj.scaleX = 1;
        obj.scaleY = 1;
        this.forceRender(obj);
      }
      this.saveUndo();
    });

    this.canvas.on('object:added', (event) => {
      if (event.target.isBackground || event.target.isHidden) {
        return;
      }
      this.saveUndo();
    });

    this.canvas.on('object:removed', (event) => {
      if (event.target.isBackground || event.target.isHidden) {
        return;
      }
      this.saveUndo();
    });

    // Auto-align object when dragged
    this.canvas.on("object:moving", (event) => {
      event.target.left = Math.round(event.target.left);
      event.target.top = Math.round(event.target.top);

      // lock top position if shift key is held
      if (event.e.shiftKey && this.lockedTop === null) {
        this.lockedTop = event.target.top;
      } else if (!event.e.shiftKey) {
        this.lockedTop = null;
      }
      // lock left position if alt key is held
      if (event.e.altKey && this.lockedLeft === null) {
        this.lockedLeft = event.target.left;
      } else if (!event.e.altKey) {
        this.lockedLeft = null;
      }

      // ignore alignment when the ctrl key is held down
      if (!event.e.ctrlKey) {
        this.aligner.alignDragging(event.target, this.canvas);
      }

      if (this.lockedTop !== null) {
        event.target.top = this.lockedTop;
      }
      if (this.lockedLeft !== null) {
        event.target.left = this.lockedLeft;
      }
    });

    // Auto-align when scaling
    this.canvas.on('object:scaling', (event) => {
      // ignore alignment when the ctrl key is held down
      if (!event.e.ctrlKey) {
        this.aligner.alignScaling(event.target, this.canvas);
      }
    });

    // Auto-fit text
    this.canvas.on('text:changed', (event) => {
      const text = event.target;
      if (!text.isAutoFit) {
        return;
      }
      if (text.width > text.fixedWidth) {
        text.fontSize *= text.fixedWidth / (text.width + 1);
        text.width = text.fixedWidth;
      }
    })

    // initialize the canvas
    this.clearCanvas();
    this.past = [];

    // load svg
    /*
      fabric.loadSVGFromURL('assets/flyer5.svg', (objects, options) => {
        objects.forEach(obj => console.log(obj));
        const shape = fabric.util.groupSVGElements(objects, options);
        this.canvas.add(shape);
        // shape.set({ left: 200, top: 100 }).setCoords();
        this.canvas.renderAll();
      }, (el, obj) => {
        obj.id = el.getAttribute('id');
        console.log('svg element: ' + obj.id);
      });
    */

    fabric.util.addListener(document.body, 'keydown', (options) => {
      var Direction = {
        LEFT: 0,
        UP: 1,
        RIGHT: 2,
        DOWN: 3
      };
      if (options.repeat) {
        return;
      }
      var key = options.which || options.keyCode; // key detection
      if (key === 37) { // handle Left key
        this.moveSelected(Direction.LEFT);
      } else if (key === 38) { // handle Up key
        this.moveSelected(Direction.UP);
      } else if (key === 39) { // handle Right key
        this.moveSelected(Direction.RIGHT);
      } else if (key === 40) { // handle Down key
        this.moveSelected(Direction.DOWN);
      }
    });
  }

  moveSelected(direction) {
    var Direction = {
      LEFT: 0,
      UP: 1,
      RIGHT: 2,
      DOWN: 3
    };
    const STEP = 10;
    var activeObject = this.canvas.getActiveObject();

    if (activeObject) {
      switch (direction) {
        case Direction.LEFT:
          activeObject.left = activeObject.left - STEP;
          break;
        case Direction.UP:
          activeObject.top = activeObject.top - STEP;
          break;
        case Direction.RIGHT:
          activeObject.left = activeObject.left + STEP;
          break;
        case Direction.DOWN:
          activeObject.top = activeObject.top + STEP;
          break;
      }
      activeObject.setCoords();
      this.canvas.renderAll();
      console.log('selected objects was moved');
    } else {
      console.log('no object selected');
    }

  }

  canvasToJSON() {
    return this.canvas.toJSON(fabricObjectFields);
  }

  /**
   * Deletes all content and clears the canvas, then recreates the bounding box.
   */
  clearCanvas() {
    this.disableHistory = true;
    this.canvas.clear();
    const base = this.factory.createProductBase(this.canvas);
    Object.assign(this, base);
    this.refreshCanvasSize();
    this.disableHistory = false;
    this.saveUndo();
  }

  /** 
   * Refreshes the template size 
   */
  refreshCanvasSize() {
    const productType = this.template.productType;
    this.background.set({
      width: productType.width * productSpecs.dpi + productSpecs.bleedInches * productSpecs.dpi * 2,
      height: productType.height * productSpecs.dpi + productSpecs.bleedInches * productSpecs.dpi * 2
    });
    this.safeArea.set({
      width: productType.width * productSpecs.dpi - productSpecs.safeInches * productSpecs.dpi * 2,
      height: productType.height * productSpecs.dpi - productSpecs.safeInches * productSpecs.dpi * 2
    });
    this.printArea.set({
      width: productType.width * productSpecs.dpi,
      height: productType.height * productSpecs.dpi
    });

    this.canvas.centerObject(this.background);
    this.canvas.centerObject(this.safeArea);
    this.canvas.centerObject(this.printArea);
    this.canvas.renderAll();
  }

  saveUndo() {
    if (this.disableHistory) return;
    this.past.push(this.present);
    this.present = this.canvasToJSON();
    this.future = [];
  }

  undo() {
    if (this.past.length > 0) {
      this.future.unshift(this.present);
      this.present = this.past.pop();
      this.disableHistory = true;
      this.canvas.loadFromJSON(this.present, _ => {
        this.background = this.canvas.getObjects('rect').filter(obj => obj.isBackground)[0];
        this.disableHistory = false;
      });
    }
  }

  redo() {
    if (this.future.length > 0) {
      this.past.push(this.present);
      this.present = this.future.shift();
      this.disableHistory = true;
      this.canvas.loadFromJSON(this.present, _ => {
        this.background = this.canvas.getObjects('rect').filter(obj => obj.isBackground)[0];
        this.disableHistory = false;
      });
    }
  }

  uploadImage(file: File) {
    const obj = this.selection;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.openDialog(reader.result, obj)
    });
    reader.readAsDataURL(file);
  }

  openDialog(dataURL, obj) {
    const dialogRef = this.dialog.open(CropDialog, {
      data: {
        url: dataURL,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY
      }
    });
    dialogRef.afterClosed().take(1).subscribe((data) => {
      if (data) {
        obj.setSrc(data, _ => {
          obj.set({
            scaleX: 1,
            scaleY: 1
          })
          this.canvas.renderAll()
        });
      }
    });
  }

  setViewSide(side: 'front' | 'back') {
    const lastSide = this.viewSide;
    this.viewSide = side;
    this.template[lastSide] = this.canvasToJSON();
    console.log(this.template);
    this.clearCanvas();
    if (this.template[this.viewSide]) {
      this.canvas.loadFromJSON(this.template[this.viewSide], _ => {
        this.saveUndo();
      });
    }
  }

  setBorderRadius(amount) {
    this.selection.set({
      rx: amount,
      ry: amount
    });
    this.forceRender(this.selection);
  }

  clickNew() {
    if (confirm('Unsaved changes will be lost. Are you sure you want to start a new template?')) {
      this.template = Object.assign({}, this.defaultTemplate);
      this.clearCanvas();
    }
  }

  clickSave(saveNew?: boolean) {
    if (!this.template.name) {
      alert('You need to set a name for this design!');
      return;
    }

    this.template[this.viewSide] = this.canvasToJSON();
    const canvasData = {
      front: this.template.front,
      back: this.template.back
    };

    // add required fonts to template data
    const fonts = [];
    this.canvas.forEachObject((obj: any) => {
      const family = obj.fontFamily;
      if (family && !fonts.includes(family)) {
        fonts.push(family);
      }
    });
    this.template.fonts = fonts;

    const dialogRef = this.dialog.open(AdminDesignerProgressDialog);

    (new Promise((resolve, reject) => {
      const docData = Object.assign({}, this.template);
      delete docData.front;
      delete docData.back;
      if (this.template.id && !saveNew) {
        this.firestore.update(`templates/${this.template.id}`, docData).then(_ => {
          resolve(this.template.id);
        });
      } else {
        const doc = this.firestore.col('templates').ref.doc();
        docData.id = doc.id;
        this.firestore.set(`templates/${doc.id}`, docData).then(_ => {
          this.template.id = doc.id;
          resolve(doc.id);
        });
      }
    })).then(id => {
      console.log(`Saving template: ${id}`)
      console.log(canvasData)
      this.storage.putJSONNoDownloadURL(canvasData, `templates/${id}.json`)
        .then().then(file => {
          const url = file.downloadURL;
          console.log('StorageService subscription returned URL: ' + url)
          if (url) {
            // create thumbnail
            const thumbData = this.createThumbnail();
            this.storage.putBase64(thumbData, `thumbnails/${id}.jpg`)
              .then().then(thumbnail => {
                console.log('Uploaded thumbnail to storage at URL: ' + thumbnail.downloadURL);
                this.template.thumbnail = thumbnail.downloadURL;
                this.template.url = url;
                this.firestore.update(`templates/${id}`, { url, thumbnail: thumbnail.downloadURL })
                  .then(() => {
                    console.log('Finished saving template.');
                    dialogRef.close();
                    window.alert('Finished saving template.')
                    console.log(this.template);
                  })
              });
          }
        });
    });
  }

  createThumbnail() {
    const sizes = thumbnailSizes[this.template.productType.size];

    console.log('canvas width: ' + this.canvas.width);
    console.log('print left: ' + this.printArea.left);
    console.log('canvas height: ' + this.canvas.height);
    console.log('print top: ' + this.printArea.top);

    const cropTop = 82;

    const dataUrl = this.canvas.toDataURL({
      format: 'jpg',
      left: this.canvas.width + this.printArea.left * 2,
      top: cropTop,
      width: this.printArea.width * this.canvas.getZoom(),
      height: this.printArea.height * this.canvas.getZoom(),
      multiplier: sizes.width / (this.printArea.width * this.canvas.getZoom())
    });

    // opens window for testing
    /** 
      const iframe = `
        <div>
          Canvas Height: ${this.canvas.height}
        </div>
        <div>
          Print Top: ${this.printArea.top}
        </div>
        <div>
          Crop Top: ${cropTop}
        </div>
        <iframe width='100%' height='100%' src=${dataUrl}></iframe>
      `;
      const x = window.open();
      x.document.open();
      x.document.write(iframe);
      x.document.close();
    */

    return dataUrl;
  }

  clickSaveNew() {
    this.clickSave(true);
  }

  loadTemplate(template: any) {
    console.log(template);
    const dialogRef = this.dialog.open(AdminDesignerProgressDialog);
    this.disableHistory = true;
    this.template = template;
    this.viewSide = 'front';
    this.storage.getFile(template.url).take(1).subscribe((data: any) => {
      if (data.front) {
        this.canvas.loadFromJSON(data['front'], _ => {
          this.background = this.canvas.getObjects('rect').filter(obj => obj.isBackground)[0];
          this.disableHistory = false;
          dialogRef.close();
        });
        this.template['back'] = data['back'];
      } else {
        dialogRef.close();
      }
    });
  }

  colorPickerChange(event) {
    if (this.selection.type === 'group') {
      this.selection.forEachObject(obj => {
        if (obj.type === 'textbox') {
          obj.set({ fill: event });
          this.forceRender(obj);
        } else {
          obj.set({ fill: event, backgroundColor: event });
        }
      });
    } else if (this.selection.type === 'rect') {
      this.selection.set({ backgroundColor: event });
    } else if (this.selection.type === 'textbox') {
      this.forceRender(this.selection);
    } else if (this.selection.type === 'path') {
      this.selection.set({ fill: event });
      this.forceRender(this.selection);
    }
    this.canvas.renderAll();
  }

  onColorChange(event: BrandColorChangeEvent) {
    const color = new fabric.Color(event.color);
    this.canvas.forEachObject(obj => {
      if (obj.brandColorRole === event.role) {
        obj.set({ fill: event.color });
      }
    });
    this.template.brandColors[event.role] = event.color;
    this.canvas.renderAll();
  }

  setBrandColorRole(role: BrandColorRole) {
    this.selection.brandColorRole = role;
    if (role !== 'none') {
      const color = this.template.brandColors[role];
      this.selection.set({ fill: color });
      this.canvas.renderAll();
    }
  }

  shadowColorPickerChange(event) {
    // bind the opacity to the color
    this.selection.shadow.opacity = new fabric.Color(this.selection.shadow.color).getAlpha();
    this.canvas.renderAll();
    this.saveUndo();
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
      if (this.selection._objects) {
        this.selection.forEachObject(obj => this.canvas.remove(obj));
      } else {
        this.canvas.remove(this.selection);
      }
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }
  }

  bringForward() {
    fabric.canvas.bringForward(this.selection, false);
  }
  sendBackward() {
    this.canvas.sendBackwards(this.selection, false);
  }
  bringToFront() {
    this.canvas.bringToFront(this.selection);
  }
  sendToBack() {
    this.canvas.sendToBack(this.selection);
    this.canvas.sendToBack(this.safeArea);
    this.canvas.sendToBack(this.printArea);
    this.canvas.sendToBack(this.background);
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

      if (dataText) {
        this.selection.set({ text: dataText });
        this.canvas.renderAll();
      }

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

  setStyle(object, styleName, value) {
    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
    }
    else {
      object[styleName] = value;
    }
  }

  getStyle(object, styleName) {
    return (object.getSelectionStyles && object.isEditing)
      ? object.getSelectionStyles()[styleName] || object[styleName]
      : object[styleName];
  }

  toggleBold() {
    const isBold = this.getStyle(this.selection, 'fontWeight') === 'bold';
    this.setStyle(this.selection, 'fontWeight', isBold ? '' : 'bold');
    this.forceRender(this.selection);
    this.saveUndo();
  }

  toggleItalics() {
    const isItalic = this.getStyle(this.selection, 'fontStyle') === 'italic';
    this.setStyle(this.selection, 'fontStyle', isItalic ? '' : 'italic');
    this.forceRender(this.selection);
    this.saveUndo();
  }

  toggleUnderline() {
    const isUnderline = (this.getStyle(this.selection, 'textDecoration') || '').indexOf('underline') > -1;
    this.setStyle(this.selection, 'textDecoration', isUnderline ? '' : 'underline');
    this.forceRender(this.selection);
    this.saveUndo();
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

  changeClipPath() {
    const obj = this.selection;
    if (obj.cx1 && obj.cy1 &&
      obj.cx2 && obj.cy2 &&
      obj.cx3 && obj.cy3 &&
      obj.cx4 && obj.cy4) {

      console.log(obj)

      this.selection.set({
        clipTo: function (ctx) {
          // ctx.arc(0, 0, 50, 0, Math.PI * 2, true);
          ctx.beginPath();
          ctx.moveTo(this.cx1, this.cy1);
          ctx.lineTo(this.cx2, this.cy2);
          ctx.lineTo(this.cx3, this.cy3);
          ctx.lineTo(this.cx4, this.cy4);
          ctx.lineTo(this.cx1, this.cy1);
          ctx.fill();
        }
      });

      this.canvas.renderAll();
    }
  }

  removeExtraLines() {
    // reverse ability to edit
    this.canvas.forEachObject((obj) => {
      if (obj.isHidden) {
        obj.set({
          selectable: !obj.selectable,
          hasControls: !obj.hasControls
        })
      }
    });
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
