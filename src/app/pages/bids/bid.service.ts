import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { bid } from '../../models/bid.model';
import { switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { base64ToFile } from 'ngx-image-cropper';

@Injectable({
    providedIn: 'root'
})
export class BidService {
    bidsRef!: AngularFirestoreCollection<any>;

    constructor(
        private firestore: AngularFirestore,
        private fireAuth: AngularFireAuth,
        private fireStorage: AngularFireStorage
    ) {
    }

    async createBid(data: bid, avatar: string) {
        const user = await this.fireAuth.currentUser;
        data.userId = user!.uid;
        this.firestore.collection('bids').add({
            ...data,
            uid: user!.uid
        }).then(async (newDocRef) => {
            data.id = newDocRef.id;
            if (avatar) {
                return this.firestore
                    .collection('bids')
                    .doc(data.id)
                    .update(data);
            } else {
                return this.firestore
                    .collection('bids')
                    .doc(data.id)
                    .update(data);
            }
        });
    }
    getBids() {
        return this.fireAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    console.log('getBids', user.uid);
                    return this.firestore
                        .collection<bid>('bids', ref =>
                            ref.where('uid', '==', user.uid).orderBy('lastName')
                        )
                        .valueChanges({ idField: 'id' });
                } else {
                    return [];
                }
            }),
        );
    }
    updateBids(item: bid, avatar: string) {
        return this.firestore
            .collection('bids')
            .doc(item.id)
            .update(item).then(async () => {
                if (avatar) {
                    return this.firestore
                        .collection('bids')
                        .doc(item.id)
                        .update(item);
                } else {
                    return this.firestore
                        .collection('bids')
                        .doc(item.id)
                        .update(item);
                }
            });
    }
    deleteBid(id: string) {
        return this.firestore
            .collection('bids')
            .doc(id)
            .delete();
    }

    async uploadImage(collection: string, uid: string, file: any): Promise<string> {
        /**
         * You can add random number in file.name to avoid overwrites,
         * or replace the file.name to a static string if you intend to overwrite
         */
        const fileRef = this.fireStorage.ref(collection).child(uid);

        // Upload file in reference
        if (!!file) {
            const imageFile = base64ToFile(file);
            const result = await fileRef.putString(file.replace('data:image/jpeg;base64,', ''), 'base64', { contentType: 'image/png' });

            return await result.ref.getDownloadURL();
        } else {
            return '';
        }
    }
}