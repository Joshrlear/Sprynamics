import { DesignState } from '#models/design-state.model'
import { Injectable } from '@angular/core'
import { Store, Select } from '@ngxs/store';
import {SetDesignState, UpdateDesignState} from '#app/checkout/app.actions';

@Injectable()
export class StateService {
  designState: DesignState;

  constructor(private store: Store) {}

  setDesignState(state) {
    // this.store.dispatch(new UpdateDesignState(state));
    localStorage.setItem('sprynamicsDesign', JSON.stringify(state))
  }

  updateDesignState(payload) {
    this.store.dispatch(new UpdateDesignState(payload));
  }

  loadFromStorage() {
    const json = localStorage.getItem('sprynamicsDesign')
    if (json) {
      // this.store.dispatch(new SetDesignState(JSON.parse(json)));
      return JSON.parse(json)
    } else {
      return null
    }
  }
}
