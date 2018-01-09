import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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

  constructor(private element: ElementRef) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: this.view.nativeElement.clientWidth,
      height: this.view.nativeElement.clientHeight
    });

    this.boundBox = new fabric.Rect({
      width: 500,
      height: 600,
      fill: 'transparent',
      stroke: '#777',
      strokeDashArray: [5,5]
    });

    this.shape = new fabric.Rect({
      width: 200,
      height: 200,
      fill: 'red',
    });

    this.canvas.add(this.boundBox);
    this.canvas.add(this.shape);

    this.canvas.centerObject(this.boundBox);
  }

  addText() {

  }

  addShape() {
    const shape = new fabric.Rect({
      width: 200,
      height: 200,
      fill: 'red',
    });

    this.canvas.add(shape);
  }

  addImage() {

  }

}
