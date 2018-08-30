import { DesignState } from '#models/design-state.model'
import { Injectable } from '@angular/core'
import { Store, Select } from '@ngxs/store';
import {SetDesignState, UpdateDesignState, UpdateOrder} from '#app/checkout/app.actions';

@Injectable()
export class StateService {
  designState: DesignState;

  constructor(private store: Store) {}

  setDesignState(state) {
    // this.store.dispatch(new UpdateDesignState(state));
    localStorage.setItem('sprynamicsDesign', JSON.stringify(state))
  }

  updateDesignState(payload) {
    this.setDesignState(payload);
    this.store.dispatch(new UpdateDesignState(payload));
  }

  setOrderState(state) {
    localStorage.setItem('orderState', JSON.stringify(state))
  }

  getOrderStateFromStorage() {
    const json = localStorage.getItem('orderState');
    if (json) {
      this.store.dispatch(new UpdateOrder(JSON.parse(json)));
      return JSON.parse(json)
    } else {
      return {};
    }
  }

  loadFromStorage() {
    const json = localStorage.getItem('sprynamicsDesign')
    if (json) {
      this.store.dispatch(new SetDesignState(JSON.parse(json)));
      return JSON.parse(json)
    } else {
      return null
    }
  }
}
