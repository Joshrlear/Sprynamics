import { Injectable } from '@angular/core';

import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  putFile(file: File, path: string) {
    // return this.storage.ref(path).put(file).downloadURL();
    return this.storage.upload(path, file).downloadURL();
  }

  putJSON(data: any, path: string) {
    return this.storage.ref(path).putString(JSON.stringify(data)).downloadURL();
  }

  putBase64(data: string, path: string) {
    return this.storage.ref(path).putString(data, 'data_url', {contentType:'image/jpeg'}).downloadURL();
  }

  getDownloadURL(path) {
    return this.storage.ref(path).getDownloadURL();
  }

  getFile(url) {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onload = (event) => {
        resolve(xhr.response);
      };
      xhr.open('GET', url);
      xhr.send();
    }));
  }
}
