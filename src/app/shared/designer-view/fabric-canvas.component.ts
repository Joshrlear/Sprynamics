import "fabric"
declare let fabric

import "webfontloader"
declare let WebFont

import { Component, OnInit, HostListener, AfterViewInit, ElementRef, ViewChild } from "@angular/core"
import { Design } from "#app/models/design.interface"

@Component({
  selector: "app-fabric-canvas",
  template: `
    <div #shell class="shell">
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
    }
  `
  ]
})
export class FabricCanvasComponent implements AfterViewInit {
  @ViewChild("shell") shell: ElementRef

  canvas: any
  fabricData: any

  constructor() {}

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas("canvas", {
      width: this.shell.nativeElement.clientWidth,
      height: this.shell.nativeElement.clientHeight
    })
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), 1)

    /* resize canvas to fill the container */
    this.canvas.setWidth(this.shell.nativeElement.clientWidth)
    this.canvas.setHeight(this.shell.nativeElement.clientHeight)

    /* center all objects */
    const objects = this.canvas.getObjects()
    const selection = new fabric.ActiveSelection(objects, {
      canvas: this.canvas
    })
    const width = selection.width
    const height = selection.height
    const scale = Math.min(this.canvas.width / width, this.canvas.height / height)
    // selection.left = this.canvas.width / 2;
    // selection.top = 0;
    // selection.originX = 'left'
    // selection.originY = 'top'
    selection.center()
    selection.destroy()

    /* zoom canvas to fit */
    this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2, this.canvas.height / 2), Math.min(scale, 1))
  }

  async loadDesign(design: Design) {
    if (!design.fonts || design.fonts.length === 0) {
      design.fonts = ["Roboto"]
    }
    WebFont.load({
      google: {
        families: design.fonts
      },
      active: async () => {
        try {
          this.fabricData = await (await fetch(design.url)).json()
          await this.loadFromJSON(this.fabricData.front)
          this.onResize()
        } catch (err) {
          window.alert(err.message)
          console.error(err)
        }
      },
      fontinactive: err => {
        window.alert(err.message)
        console.error(err)
      }
    })
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
}
