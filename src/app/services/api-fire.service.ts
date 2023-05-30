import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';
import { KeyValue } from '@angular/common';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ApiFireService {
  itemsRef!: AngularFirestoreCollection<any>;
  itemRef!: AngularFirestoreDocument<any>;
  items!: Observable<any[]>;

  constructor(private firestore: AngularFirestore) { }

  getAll(collection: string): Observable<any[]> {
    this.itemsRef = this.firestore.collection(collection);
    return this.itemsRef.valueChanges({ idField: 'id' });
  }

  getByParms(dbPath: string, parms: KeyValue<string, string>[]): Observable<any[]> {
    let collection = this.firestore.collection(dbPath, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      parms.forEach(parm => {
        query = query.where(parm.key, '==', parm.value);
      });
      return query;
    });

    return collection.valueChanges({ idField: 'id' });
  }

  getRealtimeData(collection: string): Observable<any[]> {
    this.items = this.firestore.collection(collection).valueChanges();
    return this.items;
  }

  get(collection: string, key: string): Observable<any> {
    this.itemRef = this.firestore.doc(collection + '/' + key);
    return this.itemRef.valueChanges({ idField: 'id' });
  }

  create(collection: string, item: any): Promise<DocumentReference<any>> {
    this.itemsRef = this.firestore.collection(collection);
    return this.itemsRef.add(item).then(doc => {
      return doc;
    });
  }

  update(collection: string, key: string, data: any): Promise<DocumentReference<any>> {
    const docRef = this.firestore.collection(collection).doc(key).ref;
    return docRef.get().then(doc => {
      if (doc.exists) {
        return docRef.update(data).then(() => {
          return docRef;
        });
      } else {
        //return docRef.set(data).then(() => {
          return docRef;
        //});
      }
    });
    
    // return this.firestore.collection(collection).doc(key).update(data).then(() => {
    //   return this.firestore.collection(collection).doc(key).ref;
    // });
  }

  delete(collection: string, key: string): Promise<void> {
    this.itemRef = this.firestore.doc(collection + '/' + key);
    return this.itemRef.delete();
  }
}