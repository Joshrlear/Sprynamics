import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AppStateModel, Order } from '#models/state.model';
import { SetUser, UpdateUser, CreateOrder, UpdateOrder, SubmitOrder } from './app.actions';

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
  updateUser({ patchState, getState, setState }: StateContext<AppStateModel>, { payload }: UpdateUser) {
    const state = getState();
    setState({ user: state.user, ...payload})
  }

  @Action(CreateOrder)
  createOrder({getState, patchState }: StateContext<AppStateModel>, { payload }: CreateOrder) {
    patchState({ order: payload })
  }

  @Action(UpdateOrder)
  updateOrder({getState, patchState, setState }: StateContext<AppStateModel>, { payload }: UpdateOrder) {
    const state = getState();
    setState({ order: state.order, ...payload})
  }

  @Action(SubmitOrder)
  submitOrder({getState, patchState }: StateContext<AppStateModel>, { payload }: SubmitOrder) {
    // patchState({
    //   orders: getState().orders
    // })
  }
}
