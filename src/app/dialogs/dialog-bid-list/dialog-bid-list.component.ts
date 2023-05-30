import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { first, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { bid } from 'src/app/models/bid.model';
import { load } from 'src/app/models/load.model';
import { vehicle } from 'src/app/models/vehicle.model';
import { driver } from 'src/app/models/driver.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StarRatingColor } from 'src/app/widgets/star-rating/star-rating.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VariableService } from 'src/app/services/variable.service';
import { DialogLoadComponent } from 'src/app/dialogs/dialog-load/dialog-load.component';
import { DialogBidComponent } from 'src/app/dialogs/dialog-bid/dialog-bid.component';
import { Router } from '@angular/router';

@Component({
    selector: 'dialog-bid-list',
    templateUrl: 'dialog-bid-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DialogBidListComponent {
    loading: boolean = true;
    loadId: string;
    form!: FormGroup;
    loadList: load[] = [];
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];

    displayedColumns: string[];
    dataSource: MatTableDataSource<bid>;
    @ViewChild(MatPaginator, { static: false }) paginatorBid!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortBid!: MatSort;

    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;

    formErrors: any;
    formValid!: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;
    previewImage: string | null = null;
    readOnly: boolean = false;
    bidRow: load;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogBidListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
    ) {
        this.displayedColumns = ['cud', 'userCompany', 'loadDescription', 'vehicleDescription', 'driverDescription', 'price', 'statusDescription'];

        this.loadId = data.loadId;
        this.loadList = data.loadList;
        this.vehicleList = data.vehicleList;
        this.driverList = data.driverList;
        this.formErrors = data.formErrors;
        this.formData = data;
        this.bidRow = data.item;
        setTimeout(() => {
            this.readOnly = data.readOnly == 1 ? true : false;
        }, 100);
        //console.log(data.item.bids);
        this.dataSource = new MatTableDataSource(data.item.bid);

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.loading = false;
        // this.getBids().then(getBidResult => {
        //     this.dataSource = new MatTableDataSource(getBidResult);
        //     this.loading = false;
        // });
    }

    getBids(): Promise<bid[]> {
        var promise = new Promise<bid[]>((resolve) => {
            try {
                //CHECK ERROR
                /*
                this.apiService.post('loads', 'bid', { id: this.loadId }).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                                this.loading = false;
                            }
                        }
                    },
                    error: (error: string) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                        this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
                */
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    initUpsert(row:any, readOnly: number) {
        this.form = this._formBuilder.group({
            userId: [row == null ? localStorage.getItem('userId') : row.userId],
            loadId: [{ value: row == null ? null : row.loadId, disabled: readOnly == 1 }, Validators.required],
            vehicleId: [{ value: row == null ? null : row.vehicleId, disabled: readOnly == 1 }, Validators.required],
            driverId: [{ value: row == null ? null : row.driverId, disabled: readOnly == 1 }, Validators.required],
            price: [{ value: row == null ? null : row.price, disabled: readOnly == 1 }, Validators.required],
            dateOut: [{ value: row == null ? null : row.dateOut, disabled: readOnly == 1 }, Validators.required],
            dateIn: [{ value: row == null ? null : row.dateIn, disabled: readOnly == 1 }, Validators.required],
            statusId: ['B3B7D04D-64B7-4ED7-BFE1-CF06D2B4A8AB'],
            reviewDriver: [row.reviewDriver],
            reviewDriverCount: [row.reviewDriverCount]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            loadList: this.loadList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            title: readOnly ? 'View' : row == null ? 'Insert' : 'Update',
            readOnly: readOnly
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
                row.statusId = row.statusId.toString();
                if (readOnly == 1) {
                    this.apiService.updateItem('bids', result).then((apiResult: any) => {
                        this.getBids().then(getBidResult => {
                            this.dataSource = new MatTableDataSource(getBidResult);
                            this.loading = false;
                        });
                    });
                } else {
                    if (row == null) {
                        this.apiService.createItem('bids', result).then((apiResult: any) => {
                            this.getBids().then(getBidResult => {
                                this.dataSource = new MatTableDataSource(getBidResult);
                                this.loading = false;
                            });
                        });
                    } else {
                        this.apiService.updateItem('bids', result).then((apiResult: any) => {
                            this.getBids().then(getBidResult => {
                                this.dataSource = new MatTableDataSource(getBidResult);
                                this.loading = false;
                            });
                        });
                    }
                }
            }
        });
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    onRatingChanged(rating:number) {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}