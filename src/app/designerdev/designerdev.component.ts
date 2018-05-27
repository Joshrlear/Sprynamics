import { Component, OnInit, ViewChild, HostListener } from '@angular/core'
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
import { promiseImage } from '#app/helpers/promise-image'

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
  processing = false
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
    this.processing = true
    try {
      /* load fonts */
      if (!design.fonts || design.fonts.length === 0) {
        design.fonts = ['Roboto']
      }
      await this.webfont.load(design.fonts)
      /* fetch json data from url */
      this.designState.canvasData = await (await fetch(design.url)).json()
      /* load canvas from json */
      await this.fabricCanvas.loadFromJSON(this.designState.canvasData.front)
      this.viewSide = 'front'
      /* process canvas */
      await this.processCanvas()
    } catch (err) {
      window.alert(err.message)
      console.error(err)
    }
    this.processing = false
  }

  async processCanvas() {
    this.processing = true
    try {
      /* resize to fit screen */
      this.fabricCanvas.zoomToFit()
      /* clear previous fields */
      this.designState.textFields = []
      this.designState.agentFields = []
      /* find objects */
      this.designState.backgroundObj = this.fabricCanvas.findObjects(obj => obj.isBackground, true)[0]
      this.designState.boundBoxObj = this.fabricCanvas.findObjects(obj => obj.isBoundBox, true)[0]
      this.designState.addressObj = this.fabricCanvas.findObjects(obj => obj.textContentType === 'address')[0]
      console.log(this.designState.addressObj)
      /* map text fields */
      const fieldFromObject = obj => ({ obj, name: obj.textFieldName || obj.textUserData })
      this.designState.textFields = this.fabricCanvas.findObjects(obj => obj.userEditable).map(fieldFromObject)
      this.designState.agentFields = this.fabricCanvas.findObjects(obj => obj.textContentType === 'data').map(fieldFromObject)
      this.designState.propertyFields = this.fabricCanvas.findObjects(obj => obj.textContentType === 'property').map(fieldFromObject)
      /* find property images */
      this.designState.propertyImages = this.fabricCanvas.findObjects(obj => obj.isUserImage)
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
      for (let obj of this.fabricCanvas.getObjects()) {
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
          const color = this.designState.brandColors[obj.brandColorRole]
          obj.set({ fill: color })
        }
        /* set pointer cursor for user images */
        obj.hoverCursor = obj.isUserImage ? 'pointer' : 'default'
        /* inject user images */
        if (obj.isLogo) {
          let src
          switch (obj.logoType) {
            case 'headshot':
              src = this.selectedAgent.avatarUrl
              break
            case 'brokerage':
              src = this.selectedAgent.brokerageLogoUrl
              break
            case 'company':
              src = this.selectedAgent.companyLogoUrl
              break
            default:
              src = '/assets/logo.png'
          }
          const img = await promiseImage(src)
          const width = obj.width * obj.scaleX
          const height = obj.height * obj.scaleY
          obj.setElement(img)
          obj.scaleX = width / img.width
          obj.scaleY = height / img.height
        }
      }
      // this.fabricCanvas.zoomToFit(this.designState.boundBoxObj)
      this.fabricCanvas.canvas.renderAll()
    } catch (err) {
      if (err.message) { 
        window.alert(err.message)
      }
      console.error(err)
    }
    this.processing = false
  }

  async setViewSide(viewSide: 'front' | 'back') {
    try {
      this.viewSide = viewSide
      this.processing = true
      await this.fabricCanvas.loadFromJSON(this.designState.canvasData[viewSide])
      await this.processCanvas()
      this.processing = false
    } catch (err) {
      window.alert(err.message)
      console.error(err)
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.fabricCanvas.zoomToFit(this.designState.boundBoxObj)
  }

  changeAgent(agent: User) {
    this.selectedAgent = agent
    this.checkout.setUser(agent)
  }

  changeProperty(property: any) {
    console.log(this.designState.addressObj)
    this.selectedListing = property.listing
    if (this.designState.addressObj) {
      this.designState.addressObj.text = property.formatted_address
      this.fabricCanvas.render()
    }
  }
}
