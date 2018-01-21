import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { LoadTemplateDialogComponent } from '../load-template-dialog/load-template-dialog.component';
import { FirestoreService } from '../../core/firestore.service';
import { StorageService } from '../../core/storage.service';
import { AuthService } from '../../core/auth.service';

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

  productSizes = {
    '9x6': {
      name: 'Postcard',
      width: 9,
      height: 6,
      product: 'postcard'
    },
    '11.5x6': {
      name: 'Postcard',
      width: 11.5,
      height: 6,
      product: 'postcard'
    },
    '8.5x11': {
      name: 'Flyer',
      width: 8.5,
      height: 11,
      product: 'postcard'
    },
    '11x8.5': {
      name: 'Flyer',
      width: 11,
      height: 8.5,
      product: 'postcard'
    },
    '3.5x8.5': {
      name: 'Door Hanger',
      width: 3.5,
      height: 8.5,
    }
  };

  size: string;

  @ViewChild('designerView') view: ElementRef;
  canvas: any;
  template: any = {};
  boundBox: any;
  userData: any;
  formFields: any = [];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private dialog: MatDialog, 
    private firestore: FirestoreService,
    private storage: StorageService,
    private auth: AuthService
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
        console.log(this.size);
        console.log(this.productSizes[this.size].name);
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
    });

    //const point = new fabric.Point(this.canvas.getCenter().left, this.canvas.getCenter().top);
    //this.canvas.zoomToPoint(point, this.canvas.getZoom() * 0.6);

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

  addToCart() {
    console.log(jspdf());
    this.canvas.clipTo = null;
    this.canvas.bringToFront(this.boundBox);
    this.canvas.imageSmoothingEnabled = false;
    const data = this.canvas.toDataURL();
    const doc = new jspdf({
      unit: 'in',
      format: [20, 20],
    });
    doc.addImage(data, 'PNG', 0, 0);
    doc.save('template.pdf');
  }

  loadTemplate(template: any, id: string) {
    this.template = template;
    this.template.id = id;
    this.storage.getFile(template.url).take(1).subscribe(data => {
      console.log(data);
      this.canvas.loadFromJSON(data, _ => {
        // find the boundbox
        this.boundBox = this.canvas.getObjects('rect').filter(obj => obj.isBoundBox === true)[0];
        console.log(this.boundBox);
        this.canvas.clipTo = (ctx) => {
          // this.canvas.getObjects('rect').filter(obj => obj.isBoundBox === true)[0].render(ctx);
          const c = this.boundBox.getCoords();
          const x = c[0].x;
          const y = c[0].y;
          console.log(c);
          console.log(this.boundBox.height, this.canvas.height/2);
          console.log('zoom:' + this.canvas.getZoom())
          ctx.rect(this.boundBox.left, this.boundBox.top, 
            this.boundBox.width, this.boundBox.height);
        }
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
        });
        this.canvas.renderAll();
      });
    });
  }

}