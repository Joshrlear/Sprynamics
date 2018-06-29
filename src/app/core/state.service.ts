import { DesignState } from '#models/design-state.model'
import { Injectable } from '@angular/core'

@Injectable()
export class StateService {
  designState: DesignState

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
}
