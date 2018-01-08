import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirestoreService {

  constructor(private afs: AngularFirestore) { }

  doc$<T>(path: string): Observable<T> {
    return this.afs.doc<T>(path).valueChanges();
  }

  collection$<T>(path: string): Observable<T[]> {
    return this.afs.collection<T>(path).valueChanges();
  }

  update<T>(path: string, data: Partial<T>) {
    return this.afs.doc<T>(path).update(data);
  }

  add<T>(path: string, data: T) {
    return this.afs.collection<T>(path).add(data);
  }
}
