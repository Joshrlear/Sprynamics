import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { LoadTemplateDialogComponent } from '../load-template-dialog/load-template-dialog.component';
import { FirestoreService } from '../../core/firestore.service';
import { StorageService } from '../../core/storage.service';
import { AuthService } from '../../core/auth.service';
import { productSizes, productSpecs } from '../products';
import { ObjectFactoryService } from '../object-factory.service';

import 'webfontloader';
declare let WebFont;

import 'fabric';
declare let fabric;

import * as jspdf from 'jspdf';
declare let jsPDF;

@Component({
  selector: 'app-designer-client',
  templateUrl: './designer-client.component.html',
  styleUrls: ['./designer-client.component.css']
})
export class DesignerClientComponent implements OnInit, AfterViewInit {

  productSizes = productSizes;
  size: string;

  @ViewChild('designerView') view: ElementRef;
  canvas: any;
  template: any = {};
  boundBox: any;
  userData: any;
  formFields: any = [];
  loading: boolean;
  viewSide: 'front' | 'back' = 'front';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private firestore: FirestoreService,
    private storage: StorageService,
    private auth: AuthService,
    private factory: ObjectFactoryService
  ) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe((user: any) => {
      this.userData = user;
      this.template.presetColors = user.presetColors || [];
    });
    this.route.queryParamMap.take(1).subscribe((queryParamMap: any) => {
      const querySize = queryParamMap.params['size'];
      if (querySize) {
        this.size = querySize;
        this.openTemplateDialog();
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  ngAfterViewInit() {
    this.canvas = fabric.canvas = new fabric.Canvas('canvas', {
      width: this.view.nativeElement.clientWidth,
      height: this.view.nativeElement.clientHeight,
      preserveObjectStacking: true,
      backgroundColor: '#eeeeee'
    });
  }

  injectUserData(obj) {
    if (this.userData) {
      let dataName = obj.textUserData;
      let dataText;

      if (dataName === 'name') {
        dataText = `${this.userData['firstName']} ${this.userData['lastName']}`;
      } else if (dataName === 'address') {
        dataText = `${this.userData['address1']} ${this.userData['address2']}\n` +
          `${this.userData['city']}, ${this.userData['state']}`;
      } else {
        dataText = this.userData[dataName];
      }

      obj.set({ text: dataText });
    }
  }

  openTemplateDialog() {
    const dialogRef = this.dialog.open(LoadTemplateDialogComponent, {
      data: {
        size: this.size
      }
    });

    dialogRef.afterClosed().subscribe(id => {
      if (id) {
        this.firestore.doc$(`templates/${id}`)
          .take(1).subscribe(template => this.loadTemplate(template, id));
      }
    });
  }

  getDataURL(side: 'front' | 'back', callback) {
    this.canvas.clear();
    this.canvas.loadFromJSON(this.template[side], _ => {
      if (!this.template[side].processed) {
        // this.processCanvas();
      }
      const boundBox = this.canvas.getObjects('rect').filter(obj => obj.stroke === '#f00' && obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5)[0];
      this.canvas.clipTo = null;
      this.canvas.imageSmoothingEnabled = false;
      const offsetX = boundBox.left - productSpecs.bleedInches * productSpecs.dpi;
      const offsetY = boundBox.top - productSpecs.bleedInches * productSpecs.dpi;
      // console.log(offsetX, offsetY);
      this.canvas.forEachObject(obj => {
        obj.left -= offsetX;
        obj.top -= offsetY;
        console.log(obj.left);
      });
      this.canvas.getObjects('rect').forEach(obj => {
        if (obj.strokeDashArray && obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5) {
          this.canvas.remove(obj);
        }
      }); // remove the dashed lines
      this.canvas.renderAll();

      callback(this.canvas.toDataURL());
    });
  }

  exportPDF() {
    this.getDataURL('front', front => {
      this.getDataURL('back', back => {
        const doc = new jspdf('l', 'in', [this.template.productType.width + productSpecs.bleedInches * 2, this.template.productType.height + productSpecs.bleedInches * 2]);
        doc.addImage(front, 'PNG', 0, 0);
        doc.addPage();
        doc.addImage(back, 'PNG', 0, 0);
        doc.save('template.pdf');
      });
    });
  }

  updateViewSide() {
    const lastSide = this.viewSide === 'front' ? 'back' : 'front';
    // keep track of whether the lastside was processed
    const processed = this.template[lastSide] && this.template[lastSide].processed;
    this.template[lastSide] = Object.assign(this.canvas.toObject(), { processed });
    this.canvas.clear();
    if (this.template[this.viewSide]) {
      this.canvas.loadFromJSON(this.template[this.viewSide], _ => {
        if (!this.template[this.viewSide].processed) {
          this.processCanvas();
        }
      });
    }
  }

  loadTemplate(template: any, id: string) {
    this.loading = true;
    this.template = template;
    this.template.id = id;
    this.viewSide = 'front';
    if (!this.template.fonts || this.template.fonts.length === 0) { this.template.fonts = ['Roboto']; }
    WebFont.load({
      google: {
        families: template.fonts
      },
      active: () => {
        this.storage.getFile(template.url).take(1).subscribe((data: {front: any, back: any}) => {
          this.template.front = data.front;
          this.template.back = data.back;
          this.canvas.loadFromJSON(template[this.viewSide], _ => {
            this.processCanvas();
          });
        });
      }
    });
  }

  processCanvas() {
    this.template[this.viewSide].processed = true;
    let imagesToLoad = 0;
    // find the boundbox
    this.boundBox = this.canvas.getObjects('rect').filter(obj => obj.isBoundBox === true)[0];
    this.factory.extendFabricObject(this.boundBox, ['isBoundBox']);
    console.log(this.boundBox);
    this.canvas.clipTo = (ctx) => {
      // this.canvas.getObjects('rect').filter(obj => obj.isBoundBox === true)[0].render(ctx);
      const c = this.boundBox.getCoords();
      const x = c[0].x;
      const y = c[0].y;
      console.log(c);
      console.log(this.boundBox.height, this.canvas.height / 2);
      console.log('zoom:' + this.canvas.getZoom())
      ctx.rect(this.boundBox.left, this.boundBox.top,
        this.boundBox.width, this.boundBox.height);
    }
    const canvi = document.getElementsByTagName('canvas');
    // now we center all objects
    const center = this.canvas.getCenter();
    const offset = this.boundBox.getCenterPoint();
    const xdiff = offset.x - center.left;
    const ydiff = offset.y - center.top;
    console.log(xdiff, ydiff);
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
      // inject user data in text
      if (obj.textContentType === 'data') {
        let dataName = obj.textUserData;
        let dataText;
        if (dataName === 'name') {
          dataText = `${this.userData['firstName']} ${this.userData['lastName']}`;
        } else if (dataName === 'address') {
          dataText = `${this.userData['address1']} ${this.userData['address2']}\n` +
            `${this.userData['city']}, ${this.userData['state']}`;
        } else {
          dataText = this.userData[dataName];
        }
        obj.set({ text: dataText });
      }
      // create form field if editable
      if (obj.userEditable || obj.textContentType === 'data') {
        console.log('editable');
        this.formFields.push({
          name: obj.textFieldName,
          obj: obj,
        });
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
            this.canvas.renderAll();
          }
        }
        img.src = src;
      }
    });
    // this.canvas.getObjects('rect').forEach(obj => { if (obj.isHidden) this.canvas.remove(obj); });
    if (imagesToLoad <= 0) {
      this.loading = false;

      this.canvas.renderAll();
    }
  }

}