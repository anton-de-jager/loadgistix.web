import { Injectable } from '@angular/core';
import { map, Observable, of, ReplaySubject, switchMap, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//import { User } from '@angular/fire/auth';
import { User } from 'src/app/interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User | null> {
        return this.afAuth.authState.pipe(
            switchMap(fbUser => {
                if (fbUser) {
                    return this.afs.doc<User>(`users/${fbUser.uid}`).valueChanges().pipe(
                        map(fsUser => {
                            return {
                                uid: fbUser.uid!,
                                displayName: fbUser.displayName!,
                                email: fbUser.email!,
                                photoURL: fbUser.photoURL!,
                                emailVerified: fbUser.emailVerified!,
                                isAnonymous: fbUser.isAnonymous!,
                                role: fsUser?.role || '',
                                company: fsUser?.company || '',
                                parent: fsUser?.parent || '',
                                phoneNumber: fsUser?.phoneNumber!,
                                status: fsUser?.status || '',
                                avatarChanged: fsUser?.avatarChanged || false,
                            };
                        })
                    );
                } else {
                    return of(null);
                }
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Promise<void> {
        // Separate the Firestore and Firebase User properties
        const { displayName, photoURL, phoneNumber, email, emailVerified, isAnonymous, ...firestoreUser } = user;

        // update the Firestore User document
        const firestoreUpdate = this.afs.doc<User>(`users/${user.uid}`).update(firestoreUser);

        // get the current Firebase User
        const firebaseUser = this.afAuth.currentUser;

        // update the Firebase User object
        const firebaseUpdate = firebaseUser.then(fbUser => {
            if (fbUser) {
                return fbUser.updateProfile({
                    displayName: displayName,
                    photoURL: photoURL
                });
            }else{
                return null;
            }
        });

        // return a Promise that resolves when both updates are complete
        return Promise.all([firestoreUpdate, firebaseUpdate]).then(() => { });
    }
}
