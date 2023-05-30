import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { load } from '../../models/load.model';
import { switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadService {
    loadsRef!: AngularFirestoreCollection<any>;

    constructor(
        private firestore: AngularFirestore,
        private fireAuth: AngularFireAuth
    ) {
    }

    async createLoad(data: load) {
        console.log('data', data);
        const user = await this.fireAuth.currentUser;
        data.userId = user!.uid;
        this.firestore.collection('loads').add({
            ...data,
            uid: user!.uid
        }).then(async (newDocRef) => {
            data.id = newDocRef.id;
            return this.firestore
                .collection('loads')
                .doc(data.id)
                .update(data)
        });
    }
    getLoads() {
        return this.fireAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.firestore
                        .collection<load>('loads', ref =>
                            ref.orderBy('description')
                        )
                        .valueChanges({ idField: 'id' });
                } else {
                    return [];
                }
            }),
        );
    }
    updateLoads(item: load) {
        return this.firestore
            .collection('loads')
            .doc(item.id)
            .update(item);
    }
    deleteLoad(id: string) {
        return this.firestore
            .collection('loads')
            .doc(id)
            .delete();
    }
}