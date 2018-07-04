import { fabricObjectFields } from "#app/designer/fabric-object-fields"
import { productSpecs } from "#app/models/product.model"
import { WebfontService } from "#core/webfont.service"
import { AfterViewInit, Component, ElementRef, Input, ViewChild, EventEmitter, Output } from "@angular/core"
import "fabric"
import "webfontloader"
declare let fabric
declare let WebFont

@Component({
  selector: "app-fabric-canvas",
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
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 9999;
      }
    `
  ]
})
export class FabricCanvasComponent implements AfterViewInit {
  @ViewChild("shell") shell: ElementRef
  @Input() loading: boolean = true
  @Output() click = new EventEmitter()
  canvas: any

  constructor(private webfont: WebfontService) {}

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas("canvas", {
      width: this.shell.nativeElement.clientWidth,
      height: this.shell.nativeElement.clientHeight,
      preserveObjectStacking: true
    })
    this.canvas.on('mouse:down', event => {
      if (event.target) {
        this.click.emit(event.target)
      }
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

  toJSON() {
    return new Promise((resolve, reject) => {
      try {
        const json = this.canvas.toJSON(fabricObjectFields)
        resolve(json)
      } catch (err) {
        reject(err)
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

  getObjects() {
    return this.canvas.getObjects()
  }

  findObjects(filterFn?: (obj: any) => boolean, throwError?: boolean): any[] | null {
    const arr = this.canvas.getObjects().filter(filterFn)
    if (arr.length === 0 && throwError) {
      throw new Error("No matching objects could be found. Filter function: " + filterFn)
    }
    return arr
  }

  forEachObject(fn: (obj: any) => void) {
    this.canvas.forEachObject(fn)
  }

  getDataURL(data, canvas, width, height, options?): Promise<string> {
    return new Promise((resolve, reject) => {
      canvas.clear()
      // canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), 1);
      canvas.loadFromJSON(data, _ => {
        const boundBox = canvas.getObjects("rect").filter(obj => obj.isBoundBox)[0]
        canvas.clipTo = null
        // canvas.imageSmoothingEnabled = false;
        const offsetX = boundBox.left - productSpecs.bleedInches * productSpecs.dpi
        const offsetY = boundBox.top - productSpecs.bleedInches * productSpecs.dpi
        // console.log(offsetX, offsetY);
        canvas.forEachObject(obj => {
          obj.left -= offsetX
          obj.top -= offsetY
        })
        canvas.getObjects("rect").forEach(obj => {
          if (obj.strokeDashArray && obj.strokeDashArray[0] === 5 && obj.strokeDashArray[1] === 5) {
            canvas.remove(obj)
          }
        }) // remove the dashed lines
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: (width + productSpecs.bleedInches * 2) * productSpecs.dpi,
          height: (height + productSpecs.bleedInches * 2) * productSpecs.dpi,
          fill: "#ffffff"
        })
        canvas.add(bg)
        canvas.sendToBack(bg)
        canvas.renderAll()

        resolve(canvas.toDataURL(options))
      })
    })
  }
}
