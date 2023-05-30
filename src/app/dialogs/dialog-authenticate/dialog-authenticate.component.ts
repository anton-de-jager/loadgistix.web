import { Component, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-authenticate',
  templateUrl: './dialog-authenticate.component.html',
  styleUrls: ['./dialog-authenticate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogAuthenticateComponent {

  user!: firebase.default.User | null;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAuthenticateComponent>
  ) {
    // afAuth.authState.subscribe(user => {
    //   this.user = user;
    //   if (this.user) {
    //     this.dialogRef.close();
    //     this.router.navigate(['/dashboard']);
    //   }
    // });
  }


  uiShownCallback() {
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
