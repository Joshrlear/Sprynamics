import 'fabric'
declare let fabric

import 'webfontloader'
declare let WebFont

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core'
import { Design } from '#app/models/design.interface'
import { DesignState } from '#app/models/design-state.interface'
import { WebfontService } from '#core/webfont.service'

@Component({
  selector: 'app-fabric-canvas',
  template: `
    <div #shell class="shell">
      <div *ngIf="loading" class="loading-overlay">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <canvas id="canvas" class="designer-canvas" (contextmenu)="$event.preventDefault()"></canvas>
    </div>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex: 1;
    }
    .shell {
      width: 100%;
      position: relative;
    }
    .loading-overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0,0,0,0.4);
      z-index: 9999;
    }
  `
  ]
})
export class FabricCanvasComponent implements AfterViewInit {
  @ViewChild('shell') shell: ElementRef
  @Input() loading: boolean = true
  canvas: any

  constructor(private webfont: WebfontService) {}

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: this.shell.nativeElement.clientWidth,
      height: this.shell.nativeElement.clientHeight,
      preserveObjectStacking: true
    })
  }

  render() {
    this.canvas.renderAll()
  }

  zoomToFit(boundBox?: any) {
    /* zoom out initially */
    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), 1)

    /* resize canvas to fill the container */
    this.canvas.setWidth(this.shell.nativeElement.clientWidth)
    this.canvas.setHeight(this.shell.nativeElement.clientHeight)

    /* center all objects */
    const objects = this.canvas.getObjects()
    const selection = new fabric.ActiveSelection(objects, { canvas: this.canvas })
    const width = boundBox ? boundBox.width : selection.width
    const height = boundBox ? boundBox.height : selection.height
    const scale = Math.min(this.canvas.width / width, this.canvas.height / height)
    selection.center()
    selection.destroy()

    /* zoom canvas to fit */
    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), Math.min(scale, 1))
  }

  loadFromJSON(jsonData: any) {
    return new Promise((resolve, reject) => {
      this.canvas.loadFromJSON(jsonData, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  getObjects() {
    return this.canvas.getObjects()
  }

  findObjects(filterFn?: (obj: any) => boolean, throwError?: boolean): any[] | null {
    const arr = this.canvas.getObjects().filter(filterFn)
    if (arr.length === 0 && throwError) {
      throw new Error('No matching objects could be found. Filter function: ' + filterFn)
    }
    return arr
  }

  forEachObject(fn: (obj: any) => void) {
    this.canvas.forEachObject(fn)
  }
}
