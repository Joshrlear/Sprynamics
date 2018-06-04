export class SetUsername {
  static readonly type = '[app] set username'
  constructor(public payload: string) {}
}