import { Injectable } from '@angular/core'
import { DesignState } from '#models/design-state.model'
import { ProcessingWindowComponent } from '#app/processing-window/processing-window.component'

@Injectable()
export class StateService {
  designState: DesignState
  processingWindow: ProcessingWindowComponent

  constructor() {}

  setDesignState(state) {
    localStorage.setItem('sprynamicsDesign', JSON.stringify(state))
  }

  loadFromStorage() {
    const json = localStorage.getItem('sprynamicsDesign')
    if (json) {
      return JSON.parse(json)
    } else {
      return null
    }
  }

  registerProcessingWindow(component: ProcessingWindowComponent) {
    this.processingWindow = component
  }
}
