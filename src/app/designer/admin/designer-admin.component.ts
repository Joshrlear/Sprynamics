import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { StorageService } from '../../core/storage.service';
import { productTypes, productSpecs, thumbnailSizes } from '../products';
import { ObjectFactoryService } from '../object-factory.service';
import { AlignmentService } from '#app/designer/admin/alignment.service';
import { CropDialogComponent } from '#app/designer/crop-dialog/crop-dialog.component';
import { MatDialog } from '@angular/material';

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
  productSpecs = productSpecs;

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
  currentTab = 'settings';
  currentTabIndex = 0;

  viewSide: 'front' | 'back' = 'front';

  userData: any;

  loadingFonts: boolean;
  fonts: string[];

  past = [];
  present;
  future = [];
  disableHistory = true;

  get selection() {
    if (this.canvas) {
      return this.canvas.getActiveObject() || null;
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
      console.log(event.target.isUserImage);
      if (event.target.type === 'rect') {
        event.target.width = Math.floor(event.target.width * event.target.scaleX);
        event.target.height = Math.floor(event.target.height * event.target.scaleY);
        event.target.scaleX = 1;
        event.target.scaleY = 1;
        this.forceRender(event.target);
      }
      this.saveUndo();
    });

    this.canvas.on('object:added', (event) => {
      this.saveUndo();
    });

    this.canvas.on('object:removed', (event) => {
      this.saveUndo();
    });

    // Auto-align object when dragged
    this.canvas.on("object:moving", (event) => {
      // ignore alignment when the ctrl key is held down
      if (!event.e.ctrlKey) {
        this.aligner.alignDragging(event.target, this.canvas);
      }
    });

    // Auto-align when scaling
    this.canvas.on('object:scaling', (event) => {
      // ignore alignment when the ctrl key is held down
      if (!event.e.ctrlKey) {
        this.aligner.alignScaling(event.target, this.canvas);
      }
    });

    // initialize the canvas
    this.clearCanvas();
    this.past = [];

    // fabric.loadSVGFromURL('assets/flyer5.svg', (objects, options) => {
    //   objects.forEach(obj => console.log(obj));
    //   const shape = fabric.util.groupSVGElements(objects, options);
    //   this.canvas.add(shape);
    //   // shape.set({ left: 200, top: 100 }).setCoords();
    //   this.canvas.renderAll();
    // }, (el, obj) => {
    //   obj.id = el.getAttribute('id');
    //   console.log('svg element: ' + obj.id);
    // });
  }

  canvasToJSON() {
    return this.canvas.toJSON(['isHidden', 'isBoundBox', 'isBackground', 'selectable', 'hasControls', 'textContentType', 'textUserData',
      'textFieldName', 'userEditable', 'isLogo', 'logoType', 'isUserImage']);
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

  addColor() {
    this.template.presetColors.push(this.selection.fill);
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
    const dialogRef = this.dialog.open(CropDialogComponent, {
      data: {
        url: dataURL,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY
      }
    });
    1
    dialogRef.afterClosed().take(1).subscribe((data) => {
      if (data) {
        obj.setSrc(data, _ => this.canvas.renderAll());
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

  clickNew() {
    if (confirm('Unsaved changes will be lost. Are you sure you want to start a new template?')) {
      this.template = Object.assign({}, this.defaultTemplate);
      this.clearCanvas();
    }
  }

  clickSave() {
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
    (new Promise((resolve, reject) => {
      const docData = this.template;
      delete docData.front;
      delete docData.back;
      if (this.template.id) {
        this.firestore.update(`templates/${this.template.id}`, docData).then(_ => {
          resolve(this.template.id);
        });
      } else {
        this.firestore.add('templates', docData).then(ref => {
          this.template.id = ref.id;
          resolve(ref.id);
        });
      }
    })).then(id => {
      this.storage.putJSON(canvasData, `templates/${id}.json`)
        .take(1).subscribe(url => {
          // this.canvas.remove(this.printArea);
          // this.canvas.remove(this.safeArea);
          this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), 1);
          console.log(this.printArea);
          this.canvas.deactivateAll().renderAll();
          const ctx = this.canvas.getContext('2d');
          const imgData = ctx.getImageData(this.printArea.left, this.printArea.top, this.printArea.width, this.printArea.height);
          const buffer = document.createElement('canvas');
          const bufferCtx = buffer.getContext('2d');
          buffer.width = this.printArea.width;
          buffer.height = this.printArea.height;
          bufferCtx.putImageData(imgData, 0, 0);
          const dataUrl = buffer.toDataURL('image/jpeg');
          bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
          const sizes = thumbnailSizes[this.template.productType.size];
          buffer.width = sizes.width;
          buffer.height = sizes.height;
          const img = document.createElement('img');
          img.onload = () => {
            bufferCtx.drawImage(img, 0, 0, sizes.width, sizes.height);
            const jpg = buffer.toDataURL('jpg');
            // const base = this.factory.createProductBase(this.canvas);
            // Object.assign(this, base);
            this.canvas.sendToBack(this.printArea);
            this.canvas.sendToBack(this.safeArea);
            this.canvas.sendToBack(this.background);
            this.canvas.renderAll();
            // store thumbnail
            this.storage.putBase64(jpg, `thumbnails/${id}.jpg`)
              .then().then(thumbnail => {
                // zoom back out again
                this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), 0.35);
                this.template.thumbnail = thumbnail.downloadURL;
                this.template.url = url;
                this.firestore.update(`templates/${id}`, { url, thumbnail: thumbnail.downloadURL });
              });
          }
          img.src = dataUrl;
        });
    });
  }

  loadTemplate(template: any) {
    console.log(template);
    this.disableHistory = true;
    this.template = template;
    this.viewSide = 'front';
    this.storage.getFile(template.url).take(1).subscribe(data => {
      this.canvas.loadFromJSON(data['front'], _ => {
        this.background = this.canvas.getObjects('rect').filter(obj => obj.isBackground)[0];
        console.log('done');
        this.disableHistory = false;
      }, (o, obj) => console.log(o, obj));
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

  onColorChange(event) {
    const index = event.index;
    const color = new fabric.Color(event.color);
    const lastColor = new fabric.Color(this.template.presetColors[index]);
    this.canvas.forEachObject(obj => {
      if ((new fabric.Color(obj.fill)).toHexa() === lastColor.toHexa()) {
        obj.set({ fill: event.color });
      }
    });
    this.template.presetColors[index] = event.color;
    this.canvas.renderAll();
  }

  onBgColorChange(event) {
    const color = new fabric.Color(event);
    this.background.set({
      fill: '#' + color.toHexa().split('.')[0]
    });
    this.canvas.renderAll();
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
      if (this.selection.type === 'group') {
        this.selection.forEachObject(obj => this.canvas.remove(obj));
        this.canvas
          .discardActiveGroup()
          .renderAll();
      } else {
        this.canvas.remove(this.selection);
      }
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
