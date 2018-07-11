import { Order } from '#models/state.model'
import { User } from '#models/user.model';

export class SetUser {
  static readonly type = 'setUser';

  constructor(public payload: User) {}
}

export class UpdateUser {
  static readonly type = 'updateUser';

  constructor(public payload: any) {}
}

export class CreateOrder {
  static readonly type = 'createOrder';

  constructor(public payload: Order) {}
}

export class UpdateOrder {
  static readonly type = 'updateOrder';

  constructor(public payload: any) {}
}

export class SubmitOrder {
  static readonly type = 'submitOrder';

  constructor(public payload: any) {}
}
