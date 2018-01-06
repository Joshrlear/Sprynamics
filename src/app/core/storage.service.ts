import { Injectable } from '@angular/core';

import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  putFile(file: File, path: string) {
    return this.storage.ref(path).put(file).downloadURL();
  }
}
