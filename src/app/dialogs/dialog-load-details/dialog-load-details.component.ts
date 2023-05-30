import { Component, Inject, OnInit, ViewChild , ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { load } from 'src/app/models/load.model';
import { DialogBidComponent } from 'src/app/dialogs/dialog-bid/dialog-bid.component';
import { vehicle } from 'src/app/models/vehicle.model';
import { driver } from 'src/app/models/driver.model';


@Component({
    selector: 'dialog-load-details',
    templateUrl: 'dialog-load-details.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DialogLoadDetailsComponent {
    previewImage: string | null = null;
    readOnly: boolean = false;
    bidRow: load;
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loading: boolean = false;
    formBid!: FormGroup;
    private _unsubscribeAll!: Subject<any>;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogLoadDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar) {
        this.bidRow = data.item;
        this.readOnly = data.readOnly == 1 ? true : false;
        this.vehicleList = data.vehicleList;
        this.driverList = data.driverList;
    }

    ngOnInit(): void {
        
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    initBid() {
        this.formBid = this._formBuilder.group({
            userId: [this.bidRow == null ? localStorage.getItem('userId') : this.bidRow.userId],
            loadId: [this.bidRow == null ? null : this.bidRow.id, Validators.required],
            vehicleId: [null, Validators.required],
            driverId: [null, Validators.required],
            price: [this.bidRow == null ? null : this.bidRow.price, Validators.required],
            dateOut: [this.bidRow == null ? null : this.bidRow.dateOut, Validators.required],
            dateIn: [this.bidRow == null ? null : this.bidRow.dateIn, Validators.required],
            statusId: [this.bidRow == null ? 'B3B7D04D-64B7-4ED7-BFE1-CF06D2B4A8AB' : this.bidRow.statusId]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: this.bidRow,
            form: this.formBid,
            loadList: [this.bidRow],//this.loadList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            title: 'Place a'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogBidComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.loading = true;
                this.apiService.createItem('bids', result).then(r => {
                    this.dialogRef.close(true);
                }, error => {
                    console.log(error);
                    this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    this.loading = false;
                });
            }
        });
    }
}