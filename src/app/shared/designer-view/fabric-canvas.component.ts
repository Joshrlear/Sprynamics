import "fabric"
declare let fabric

import "webfontloader"
declare let WebFont

import { Component, OnInit, HostListener, AfterViewInit, ElementRef, ViewChild, Input } from "@angular/core"
import { Design } from "#app/models/design.interface"
import { DesignState } from "#app/models/design-state.interface";
import { WebfontService } from "#core/webfont.service";

@Component({
  selector: "app-fabric-canvas",
  template: `
    <div #shell class="shell">
      <canvas id="canvas" class="designer-canvas" (contextmenu)="$event.preventDefault()"></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
    }
    .shell {
      width: 100%;
    }
  `]
})
export class FabricCanvasComponent implements AfterViewInit {
  @ViewChild("shell") shell: ElementRef
  @Input() designState: DesignState
  canvas: any

  constructor(private webfont: WebfontService) {}

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas("canvas", {
      width: this.shell.nativeElement.clientWidth,
      height: this.shell.nativeElement.clientHeight,
      preserveObjectStacking: true,
    })
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    /* zoom out initially */
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

  findObject(filterFn: (obj: any) => void) {
    const obj = this.canvas.getObjects().filter(filterFn)[0]
    if (obj) {
      return obj
    } else {
      throw new Error('The object could not be found. Filter function: ' + filterFn)
    }
  }

  forEachObject(fn: (obj: any) => void) {
    this.canvas.forEachObject(fn)
  }
}
