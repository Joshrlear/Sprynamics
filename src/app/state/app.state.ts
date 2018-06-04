import { State, Action, StateContext } from '@ngxs/store'
import { SetUsername } from './app.actions'

export interface AppStateModel {
  username: string
  orderId: number
  status?: 'pending' | 'confirmed' | 'declined'
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    username: '',
    orderId: Math.floor(Math.random() * 23000)
  }
})
export class AppState {

  @Action(SetUsername)
  setUsername({ patchState }: StateContext<AppStateModel>, { payload }: SetUsername) {
    patchState({ username: payload })
  }
}