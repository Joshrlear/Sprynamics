import { Injectable } from '@angular/core'

import { AngularFireStorage } from 'angularfire2/storage'
import { Observable } from 'rxjs'

@Injectable()
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  putFile(file: File | Blob, path: string, metadata?) {
    // return this.storage.ref(path).put(file).downloadURL();
    return this.storage.upload(path, file, metadata)
  }

  async putJSON(data: any, path: string) {
    const snapshot = await this.storage.ref(path).putString(JSON.stringify(data))
    return snapshot.downloadURL
  }

  async putPrettyJSON(data: any, path: string, numSpaces: number = 2) {
    const snapshot = await this.storage.ref(path).putString(JSON.stringify(data, null, numSpaces))
    return snapshot.downloadURL
  }

  putJSONNoDownloadURL(data: any, path: string) {
    return this.storage.ref(path).putString(JSON.stringify(data))
  }

  putBase64(data: string, path: string, contentType?: string) {
    return this.storage.ref(path).putString(data, 'data_url', { contentType: contentType || 'image/jpeg' })
  }

  getDownloadURL(path) {
    return this.storage.ref(path).getDownloadURL()
  }

  getFile(url): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'json'
      xhr.onload = event => {
        resolve(xhr.response)
      }
      xhr.open('GET', url)
      xhr.send()
    })
  }

  promiseFile(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'json'
      xhr.onload = event => {
        resolve(xhr.response)
      }
      xhr.open('GET', url)
      xhr.send()
    })
  }
}
