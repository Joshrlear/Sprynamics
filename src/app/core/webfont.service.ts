import { Injectable } from '@angular/core'
import 'webfontloader'
declare let WebFont

@Injectable()
export class WebfontService {
  constructor() {}

  load(families: string[]) {
    return new Promise((resolve, reject) => {
      WebFont.load({
        google: { families },
        active: () => {
          resolve()
        },
        fontinactive: err => {
          reject(err)
        }
      })
    })
  }
}
