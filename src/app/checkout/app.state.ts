import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AppStateModel, Order } from '#models/state.model';
import {
  SetUser,
  UpdateUser,
  CreateOrder,
  UpdateOrder,
  SubmitOrder,
  SetDesignState,
  UpdateDesignState, RemoveUser
} from './app.actions';

@State<AppStateModel>({
  name: 'app'
})

export class AppState {

  @Selector()
  static getUser(state: AppStateModel) {
    return state.user;
  }

  @Action(SetUser)
  setUser({ patchState }: StateContext<AppStateModel>, { payload }: SetUser) {
    patchState({ user: payload });
  }

  @Action(UpdateUser)
  updateUser({ patchState, getState }: StateContext<AppStateModel>, { payload }: UpdateUser) {
    const state = getState();
    patchState({ user: { ...state.user, ...payload } })
  }

  @Action(RemoveUser)
  removeUser({getState, setState }: StateContext<AppStateModel>) {
    const state = getState();
    delete state.user;
  }

  @Action(CreateOrder)
  createOrder({getState, patchState }: StateContext<AppStateModel>, { payload }: CreateOrder) {
    const state = getState();
    patchState({ order: { ...state.order, ...payload } })
  }

  @Action(UpdateOrder)
  updateOrder({getState, patchState }: StateContext<AppStateModel>, { payload }: UpdateOrder) {
    const state = getState();
    patchState({ order: { ...state.order, ...payload } })
  }

  @Action(SubmitOrder)
  submitOrder({getState, setState }: StateContext<AppStateModel>) {
    const state = getState();
    delete state.order;
  }

  @Action(SetDesignState)
  setDesignState({getState, patchState }: StateContext<AppStateModel>, { payload }: SetDesignState) {
    patchState({ designer: payload })
  }

  @Action(UpdateDesignState)
  updateDesignState({getState, patchState }: StateContext<AppStateModel>, { payload }: UpdateDesignState) {
    const state = getState();
    patchState({ designer: { ...state.designer, ...payload } })
  }
}
