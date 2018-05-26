import { Component, OnInit, ViewChild } from '@angular/core'
import { User } from '#models/user.interface'
import { DesignState } from '#models/design-state.interface'
import { AuthService } from '#core/auth.service'

import { first } from 'rxjs/operators'
import { CheckoutService } from '#app/checkout/checkout.service'
import { FirestoreService } from '#core/firestore.service'
import { FabricCanvasComponent } from '#app/shared/designer-view/fabric-canvas.component'
import { Design } from '#app/models/design.interface'
import { WebfontService } from '#core/webfont.service'
import { DEFAULT_BRAND_COLORS } from '#app/shared/colors/brand-colors.interface'

@Component({
  selector: 'app-designerdev',
  templateUrl: './designerdev.component.html',
  styleUrls: ['./designerdev.component.scss']
})
export class DesignerdevComponent implements OnInit {
  @ViewChild(FabricCanvasComponent) fabricCanvas: FabricCanvasComponent

  designState: DesignState
  agents: User[]
  user: User
  selectedAgent: User
  loading = true
  selectedListing: any
  listingId: string
  viewSide: 'front' | 'back' = 'front'

  constructor(
    private auth: AuthService,
    private checkout: CheckoutService,
    private firestore: FirestoreService,
    private webfont: WebfontService
  ) {}

  async ngOnInit() {
    try {
      this.designState = {}
      /* load user */
      const user = await this.auth.user.pipe(first()).toPromise()
      console.log(user)
      this.user = user
      /* set up design state */
      this.designState.agent = user
      this.designState.brandColors = user.brandColors || DEFAULT_BRAND_COLORS
      /* load agents */
      const managedAgents = await this.firestore.promiseColWithIds<User>('users', ref => ref.where(`managers.${user.uid}`, '==', true))
      const createdAgents = await this.firestore.promiseColWithIds<User>(`users/${user.uid}/agents`)
      this.agents = managedAgents.concat(createdAgents)
      this.selectedAgent = user
      /* initialize order */
      await this.checkout.initOrder()
      this.loading = false
    } catch (err) {
      window.alert(err.message)
      console.error(err)
    }
  }

  async loadDesign(design: Design) {
    if (!design.fonts || design.fonts.length === 0) {
      design.fonts = ['Roboto']
    }
    try {
      /* load fonts */
      await this.webfont.load(design.fonts)
      /* fetch json data from url */
      this.designState.canvasData = await (await fetch(design.url)).json()
      /* load canvas from json */
      await this.fabricCanvas.loadFromJSON(this.designState.canvasData.front)
      /* resize to fit screen */
      this.fabricCanvas.onResize()
      /* clear previous fields */
      this.designState.textFields = []
      this.designState.agentFields = []
      /* find background and bound box objects */
      this.designState.backgroundObj = this.fabricCanvas.findObject(obj => obj.isBackground)
      this.designState.boundBoxObj = this.fabricCanvas.findObject(obj => obj.isBoundBox)
      /* clip canvas to bound box */
      this.fabricCanvas.canvas.clipTo = ctx => {
        const c = this.designState.boundBoxObj.getCoords()
        const x = c[0].x
        const y = c[0].y
        const canvasCenter = this.fabricCanvas.canvas.getCenter()
        const zoom = this.fabricCanvas.canvas.getZoom()
        const bound = this.designState.boundBoxObj.getBoundingRect(false)
        ctx.rect(bound.left, bound.top, bound.width, bound.height)
      }
      /* loop through canvas objects */
      this.fabricCanvas.forEachObject(obj => {
        /* set object properties */
        obj.set({
          selectable: false,
          editable: false,
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
          objectCaching: false
        })
        /* set brand colors */
        if (obj.brandColorRole && obj.brandColorRole !== 'none') {
          const color = this.designState.brandColors[obj.brandColorRole];
          obj.set({ fill: color });
        }
      })
    } catch (err) {
      window.alert(err.message)
      console.error(err)
    }
  }

  async setViewSide(viewSide: 'front' | 'back') {
    try {
      this.viewSide = viewSide
      await this.fabricCanvas.loadFromJSON(this.designState.canvasData[viewSide])
      this.fabricCanvas.onResize()
    } catch (err) {
      window.alert(err.message)
      console.error(err)
    }
  }

  changeAgent(agent: User) {
    this.selectedAgent = agent
    this.checkout.setUser(agent)
  }
}
