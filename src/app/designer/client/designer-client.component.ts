import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { FirestoreService } from '../../core/firestore.service';
import { StorageService } from '../../core/storage.service';
import { AuthService } from '../../core/auth.service';
import { productSizes, productSpecs } from '../products';
import { ObjectFactoryService } from '../object-factory.service';
import { CheckoutService } from '#app/checkout/checkout.service';
import { NewUserPopupComponent } from '#app/designer/new-user-popup/new-user-popup.component';
import { SlipstreamService } from '#core/slipstream.service';

import 'webfontloader';
declare let WebFont;

import 'fabric';
declare let fabric;

import * as jspdf from 'jspdf';
declare let jsPDF;

import * as JSZip from 'jszip';
import { CropDialogComponent } from '#app/designer/crop-dialog/crop-dialog.component';
import { ImageSelectDialogComponent } from '#app/designer/image-select-dialog/image-select-dialog.component';
import { fabricObjectFields } from '#app/designer/fabric-object-fields';
import { GoogleMapsService } from '#core/gmaps.service';

@Component({
  selector: 'app-designer-client',
  templateUrl: './designer-client.component.html',
  styleUrls: ['./designer-client.component.css']
})
export class DesignerClientComponent implements OnInit, AfterViewInit {

  currentTab = 'agent';
  currentTabIndex = 0;

  background: any = {};

  productSizes = productSizes;
  size;

  @ViewChild('designerView') view: ElementRef;
  canvas: any;
  template: any;
  boundBox: any;
  userData: any;
  textFields = [];
  agentFields = [];
  addressObj: any;
  loading: boolean;
  loadingPdf: boolean;
  viewSide: 'front' | 'back' = 'front';
  propertyAddress: any;
  listingId: string;
  selectedListing: any;

  past = [];
  present;
  future = [];
  disableHistory: boolean;

  agents: any[];
  selectedAgent: any;
  loadingAgents: boolean;

  loadingProgress = 0;
  loadingMessage = '';

  constructor(private route: ActivatedRoute,
    public router: Router,
    private firestore: FirestoreService,
    private storage: StorageService,
    private auth: AuthService,
    private factory: ObjectFactoryService,
    private MatDialog: MatDialog,
    private checkout: CheckoutService,
    private dialog: MatDialog,
    private gmaps: GoogleMapsService
  ) { }

  ngOnInit() {
    this.loadingAgents = true;

    this.checkout.initOrder().then(_ => {
      this.auth.user.take(1).subscribe((user: any) => {
        this.userData = user;
        this.selectedAgent = user;
        const managedAgents = this.firestore.colWithIds$('users', ref => ref.where(`managers.${user.uid}`, '==', true));
        const createdAgents = this.firestore.colWithIds$(`users/${user.uid}/agents`);
        managedAgents.subscribe(agents1 => {
          createdAgents.subscribe(agents2 => {
            this.agents = agents1.concat(agents2);
            this.loadingAgents = false;
          });
        });
        // this.template.presetColors = user.presetColors || [];
        this.route.queryParamMap.take(1).subscribe((queryParamMap: any) => {
          const queryProduct = queryParamMap.params['product'];
          const querySize = queryParamMap.params['size'];
          if (queryProduct && querySize) {
            this.size = querySize;
            this.checkout.updateOrder({ 
              product: queryProduct,
            });
          } else {
            this.router.navigate(['/products']);
          }
          const queryAgent = queryParamMap.params['agent'];
          const queryListing = queryParamMap.params['listing'];
          if (queryAgent) {
            this.selectedAgent.licenseId = queryAgent;
          }
          if (queryListing) {
            this.listingId = queryListing;
          }
        });
      });
      this.firestore.colWithIds$('templates').take(1).subscribe(templates => {
        this.loadDesign(templates[0]);
        this.auth.authState.take(1).subscribe(userState => {
          if (userState.isAnonymous) {
            this.dialog.open(NewUserPopupComponent, {
              disableClose: true
            });
          }
        })
      });
    });
  }

  ngAfterViewInit() {
    fabric.Object.prototype.objectCaching = false;
    this.canvas = fabric.canvas = new fabric.Canvas('canvas', {
      width: this.view.nativeElement.clientWidth,
      height: this.view.nativeElement.clientHeight,
      preserveObjectStacking: true,
    });

    this.canvas.on('mouse:down', (event) => {
      if (event.target && event.target.isUserImage) {
        this.clickImage(event.target);
      }
    });

    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.canvas.setWidth(this.view.nativeElement.clientWidth);
    this.canvas.setHeight(this.view.nativeElement.clientHeight);

    const objects = this.canvas.getObjects();
    const selection = new fabric.ActiveSelection(objects, { canvas: this.canvas });
    const width = selection.width;
    const height = selection.height;
    const scale = this.canvas.height / height;

    selection.center();
    selection.destroy();
    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), Math.min(scale, 1));
  }

  canvasToJSON() {
    return this.canvas.toJSON(fabricObjectFields);
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
        this.processCanvas();
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
        this.processCanvas();
        this.background = this.canvas.getObjects('rect').filter(obj => obj.isBackground)[0];
        this.disableHistory = false;
      });
    }
  }

  clickImage(obj) {
    console.log(obj)
    const imageDialogRef = this.dialog.open(ImageSelectDialogComponent, {
      data: {
        listing: this.selectedListing
      }
    });
    imageDialogRef.afterClosed().subscribe(photo => {
      if (photo) {
        const cropDialogRef = this.dialog.open(CropDialogComponent, {
          data: {
            url: photo,
            width: obj.width * obj.scaleX,
            height: obj.height * obj.scaleY
          }
        });
        cropDialogRef.afterClosed().subscribe(croppedPhoto => {
          obj.setSrc(croppedPhoto, () => {
            console.log('done');
            // scale x clip paths
            obj.cx1 *= obj.scaleX;
            obj.cx2 *= obj.scaleX;
            obj.cx3 *= obj.scaleX;
            obj.cx4 *= obj.scaleX;
            // scale y clip paths
            obj.cy1 *= obj.scaleY;
            obj.cy2 *= obj.scaleY;
            obj.cy3 *= obj.scaleY;
            obj.cy4 *= obj.scaleY;
            // reset scale
            obj.set({
              scaleX: 1,
              scaleY: 1
            })
            this.canvas.renderAll();
          });
        })
      }
    });
  }

  changeAgent(agent) {
    this.selectedAgent = agent;
    this.checkout.setUser(agent);
    this.agentFields.forEach(field => {
      if (field.obj.textUserData === 'name') {
        field.obj.text = (agent.firstName || '') + (agent.lastName ? ' ' + agent.lastName : '');
      } else {
        field.obj.text = agent[field.obj.textUserData] || '';
      }
    });
    this.saveUndo();
    this.canvas.renderAll();
  }

  changeAddress(address) {
    console.log('changeAdrress', address);
    this.selectedListing = address.listing;
    if (this.addressObj) {
      this.propertyAddress = address;
      this.addressObj.text = address.formatted_address;
      this.canvas.renderAll();
    }
    const location = address.location;
    this.canvas.forEachObject(obj => {
      if (obj.isMapImage) {
        const desiredWidth = obj.width * obj.scaleX;
        const desiredHeight = obj.height * obj.scaleY;
        const left = obj.left;
        let width, height;
        if (desiredWidth > desiredHeight) {
          width = 400;
          height = Math.floor(400 * (desiredWidth / desiredHeight));
        } else {
          width = Math.floor(desiredWidth * (400 / desiredHeight));
          height = 400;
        }
        const mapImageUrl = this.gmaps.getStaticMapUrl(location.lat, location.lng, 12, 400, 400);
        fetch(mapImageUrl)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onload = () => {
              obj.setSrc(reader.result, _ => {
                // if (!obj.isFetched) {
                //   console.log('resizing');
                //   obj.left += width;
                //   obj.scaleX = desiredWidth / 400;
                //   obj.scaleY = desiredHeight / 400;
                // }
                // obj.isFetched = true;
                this.canvas.renderAll();
              }, { crossOrigin: 'Anonymous' });
            }
            reader.readAsDataURL(blob);
          });
      }
    });
  }

  changeColor(event) {
    const index = event.index;
    const color = new fabric.Color(event.color);
    const lastColor = new fabric.Color(this.template.presetColors[index]);
    this.canvas.forEachObject(obj => {
      if ((new fabric.Color(obj.fill)).toHexa() === lastColor.toHexa()) {
        console.log(obj.type);
        if (obj.type !== 'i-text' && obj.type !== 'textbox') {
          obj.set({ fill: event.color });
        }
      }
    });
    this.template.presetColors[index] = event.color;
    this.canvas.renderAll();
  }

  changeBackgroundColor(event) {
    const color = new fabric.Color(event);
    this.background.set({
      fill: '#' + color.toHexa().split('.')[0]
    });
    this.canvas.renderAll();
  }

  changePhoto(event) {
    const obj = this.template[this.viewSide].userImages[event.index];
    console.log(event.photo)
    obj.setSrc(event.photo, _ => {
      this.canvas.renderAll();
    }, { crossOrigin: 'Anonymous' });
  }

  changeViewSide(side: 'front' | 'back') {
    if (side === this.viewSide) {
      return;
    }
    const lastSide = this.viewSide;
    this.viewSide = side;
    // keep track of whether the lastside was processed
    const processed = this.template[lastSide] && this.template[lastSide].processed;
    this.template[lastSide] = Object.assign(this.canvasToJSON(), { processed });
    this.canvas.clear();
    if (this.template[this.viewSide]) {
      this.canvas.loadFromJSON(this.template[this.viewSide], _ => {
        this.processCanvas();
      });
    }
  }

  loadDesign(template: any) {
    this.loading = true;
    this.template = template;
    this.viewSide = 'front';
    if (!this.template.fonts || this.template.fonts.length === 0) { this.template.fonts = ['Roboto']; }
    WebFont.load({
      google: {
        families: this.template.fonts
      },
      active: () => {
        console.log(template);
        this.storage.getFile(template.url).take(1).subscribe((data: { front: any, back: any }) => {
          this.template.front = data.front;
          this.template.back = data.back;
          this.canvas.loadFromJSON(template[this.viewSide], _ => {
            this.processCanvas();
            this.disableHistory = false;
            if (this.listingId) {
              this.currentTab = 'property';
              this.currentTabIndex = 2;
            }
          });
        });
      },
      fontinactive: (e) => {
        console.log(e);
        console.log('error with a font');
      }
    });
  }

  processCanvas() {
    // clear previous data fields
    this.textFields = [];
    this.agentFields = [];
    // mark this side as processed
    this.template[this.viewSide].processed = true;
    let imagesToLoad = 0;
    // find the boundbox and background
    this.background = this.canvas.getObjects('rect').filter(obj => obj.isBackground)[0];
    this.boundBox = this.canvas.getObjects('rect').filter(obj => {
      return obj.isBoundBox === true
    })[0];
    this.factory.extendFabricObject(this.boundBox, ['isBoundBox']);
    this.canvas.clipTo = (ctx) => {
      const c = this.boundBox.getCoords();
      const x = c[0].x;
      const y = c[0].y;
      const canvasCenter = this.canvas.getCenter();
      const zoom = this.canvas.getZoom();
      const bound = this.boundBox.getBoundingRect(false);
      ctx.rect(bound.left, bound.top, bound.width, bound.height);
    }
    // now we center all objects
    const center = this.canvas.getCenter();
    const offset = this.boundBox.getCenterPoint();
    const xdiff = offset.x - center.left;
    const ydiff = offset.y - center.top;
    // prepare list of user images
    this.template[this.viewSide].userImages = [];
    // modify all objects
    this.canvas.forEachObject(obj => {
      obj.left -= xdiff;
      obj.top -= ydiff;
      obj.set({
        selectable: false,
        editable: false,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        objectCaching: false
      });
      // set hover cursor
      if (obj.isUserImage) {
        obj.hoverCursor = 'pointer';
      } else {
        obj.hoverCursor = 'default';
      }
      if (obj.textContentType === 'address') {
        this.addressObj = obj;
        console.log(obj);
      }
      // create form field if editable
      if (obj.userEditable || obj.textContentType === 'data') {
        const field = { name: obj.textFieldName, obj };
        if (obj.textContentType === 'plain') {
          this.textFields.push(field);
        } else {
          this.agentFields.push(field);
        }
      }
      // load user image
      if (obj.isUserImage) {
        this.template[this.viewSide].userImages.push(obj);
      }
      // inject user photos in images
      if (obj.isLogo) {
        let src;
        switch (obj.logoType) {
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
        imagesToLoad++;
        img.onload = () => {
          obj.setElement(img);
          imagesToLoad--;
          if (imagesToLoad <= 0) {
            this.loading = false;
            this.onResize();
            this.canvas.renderAll();
          }
        }
        img.src = src;
      }
    });
    // inject user data into data fields
    const agent = this.selectedAgent;
    this.agentFields.forEach(field => {
      if (field.obj.textUserData === 'name') {
        field.obj.text = (agent.firstName || '') + (agent.lastName ? ' ' + agent.lastName : '');
      } else {
        field.obj.text = agent[field.obj.textUserData] || '';
      }
    });
    // hide objects that should be hidden
    this.canvas.getObjects('rect').forEach(obj => {
      if (obj.isHidden) {
        obj.set({
          stroke: '#eeeeee00'
        });
        this.canvas.sendToBack(obj);
      }
    });
    if (imagesToLoad <= 0) {
      this.loading = false;
      this.onResize();
      this.canvas.renderAll();
    }
  }

  saveAndContinue() {
    console.log('saving');
    // create PDF from canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'pdf_canvas';
    canvas.width = (this.template.productType.width + productSpecs.bleedInches * 2) * productSpecs.dpi;
    canvas.height = (this.template.productType.height + productSpecs.bleedInches * 2) * productSpecs.dpi;
    document.body.appendChild(canvas);
    const pdfCanvas = new fabric.Canvas('pdf_canvas', {
      width: canvas.width,
      height: canvas.height,
      preserveObjectStacking: true
    });
    canvas.style.display = 'none';
    pdfCanvas.loadFromJSON(this.template['front'], _ => {
      // const boundBox = this.canvas.getObjects('rect').filter(obj => obj.stroke === '#f00' && obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5)[0];
      const boundBox = this.canvas.getObjects('rect').filter(obj => obj.isBoundBox)[0];
      pdfCanvas.clipTo = null;
      // pdfCanvas.imageSmoothingEnabled = false;
      const offsetX = boundBox.left - productSpecs.bleedInches * productSpecs.dpi;
      const offsetY = boundBox.top - productSpecs.bleedInches * productSpecs.dpi;
      // console.log(offsetX, offsetY);
      pdfCanvas.forEachObject(obj => {
        obj.left -= offsetX;
        obj.top -= offsetY;
      });
      pdfCanvas.getObjects('rect').forEach(obj => {
        if (obj.strokeDashArray && obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5) {
          pdfCanvas.remove(obj);
        }
      }); // remove the dashed lines
      const bg = new fabric.Rect({
        left: 0,
        top: 0,
        width: (this.template.productType.width + productSpecs.bleedInches * 2) * productSpecs.dpi,
        height: (this.template.productType.height + productSpecs.bleedInches * 2) * productSpecs.dpi,
        fill: '#ffffff'
      });
      pdfCanvas.add(bg);
      pdfCanvas.sendToBack(bg);
      pdfCanvas.renderAll();

      const front = pdfCanvas.toDataURL();
      this.loadingPdf = true;
      this.loadingMessage = 'Processing front side...';
      this.getDataURL('front', pdfCanvas).then((front: string) => {
        this.loadingMessage = 'Processing back side...';
        this.getDataURL('back', pdfCanvas).then((back: string) => {
          this.checkout.thumbnail = front;
          // generate PDF
          // this.loadingMessage = 'Generating PDF...';
          // const doc = new jspdf('l', 'in', [this.template.productType.width + productSpecs.bleedInches * 2, this.template.productType.height + productSpecs.bleedInches * 2]);
          // doc.addImage(front, 'PNG', 0, 0, this.template.productType.width + productSpecs.bleedInches * 2, this.template.productType.height + productSpecs.bleedInches * 2);
          // doc.addPage();
          // doc.addImage(back, 'PNG', 0, 0, this.template.productType.width + productSpecs.bleedInches * 2, this.template.productType.height + productSpecs.bleedInches * 2);
          // const pdfDataUrl: string = doc.output('blob');

          // compress files
          this.loadingMessage = 'Compressing files...';
          const zip = new JSZip();
          zip.file('front.png', front.replace(/data:image\/png;base64,/, ''), { base64: true });
          zip.file('back.png', back.replace(/data:image\/png;base64,/, ''), { base64: true });
          // zip.file('design.pdf', pdfDataUrl, { base64: true });
          zip.generateAsync({
            type: 'base64',
            compression: 'DEFLATE',
            compressionOptions: {
              level: 1
            }
          }).then(zipDataUrl => {
            // upload the design
            this.loadingMessage = 'Uploading finished design...';
            zipDataUrl = 'data:application/zip;base64,' + zipDataUrl;
            const task = this.storage.putBase64(zipDataUrl, 'design.zip', 'application/zip');
            task.percentageChanges().subscribe(snap => {
              this.loadingProgress = snap;
            });
            task.then().then(pdfSnapshot => {
              console.log(this.propertyAddress);
              this.checkout.updateOrder({
                pdfUrl: pdfSnapshot.downloadURL,
                propertyAddress: this.propertyAddress ? this.propertyAddress.formatted_address : ''
              })
              pdfCanvas.dispose();
              canvas.remove();
              this.router.navigate(['/checkout']);
            });
          });
        });
      });
    });
  }

  getDataURL(side: 'front' | 'back', canvas, options?) {
    return new Promise((resolve, reject) => {
      canvas.clear();
      // canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), 1);
      canvas.loadFromJSON(this.template[side], _ => {
        if (!this.template[side].processed) {
          // this.processCanvas();
        }
        const boundBox = canvas.getObjects('rect').filter(obj => obj.stroke === '#f00' && obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5)[0];
        canvas.clipTo = null;
        // canvas.imageSmoothingEnabled = false;
        const offsetX = boundBox.left - productSpecs.bleedInches * productSpecs.dpi;
        const offsetY = boundBox.top - productSpecs.bleedInches * productSpecs.dpi;
        // console.log(offsetX, offsetY);
        canvas.forEachObject(obj => {
          obj.left -= offsetX;
          obj.top -= offsetY;
        });
        canvas.getObjects('rect').forEach(obj => {
          if (obj.strokeDashArray && obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5) {
            canvas.remove(obj);
          }
        }); // remove the dashed lines
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: (this.template.productType.width + productSpecs.bleedInches * 2) * productSpecs.dpi,
          height: (this.template.productType.height + productSpecs.bleedInches * 2) * productSpecs.dpi,
          fill: '#ffffff'
        });
        canvas.add(bg);
        canvas.sendToBack(bg);
        canvas.renderAll();

        resolve(canvas.toDataURL(options));
      });
    });
  }
}