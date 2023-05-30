import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ApiService } from 'src/app/services/api.service';
import { bid } from 'src/app/models/bid.model';
import { driver } from 'src/app/models/driver.model';
import { load } from 'src/app/models/load.model';
import { vehicle } from 'src/app/models/vehicle.model';
import { status } from 'src/app/models/status.model';

import { first } from 'rxjs';
import { DialogBidComponent } from 'src/app/dialogs/dialog-bid/dialog-bid.component';
import { StarRatingColor } from 'src/app/widgets/star-rating/star-rating.component';
import { VariableService } from 'src/app/services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogReviewComponent } from 'src/app/dialogs/dialog-review/dialog-review.component';
import { user } from 'src/app/models/user.model';
// import { DialogPaypalComponent } from 'src/app/dialogs/dialog-paypal/dialog-paypal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Dialog } from '@capacitor/dialog';
import { GlobalConstants } from 'src/app/shared/global-constants';
//import {promises as fs} from 'fs';
import { Subscription } from 'rxjs';
import { DriverService } from '../drivers/driver.service';
import { VehicleService } from '../vehicles/vehicle.service';
import { BidService } from './bid.service';
import { LoadService } from '../loads/loads.service';

@Component({
    selector: 'bids',
    templateUrl: './bids.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BidsComponent implements OnInit, OnDestroy {
    loading: boolean = true;
    form!: FormGroup;
    loadList: load[] = [];
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    bidList: bid[] = [];
    user!: user;

    displayedColumns: string[];
    dataSource!: MatTableDataSource<bid>;
    @ViewChild(MatPaginator, { static: false }) paginatorBid!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortBid!: MatSort;

    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;

    userId = localStorage.getItem('userId');

    deleteform!: FormGroup;

    subscriptionLoads!: Subscription;
    subscriptionVehicles!: Subscription;
    subscriptionDrivers!: Subscription;
    subscriptionBids!: Subscription;

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
        private bidService: BidService,
        private vehicleService: VehicleService,
        private driverService: DriverService,
        private loadService: LoadService,

        private route: ActivatedRoute,
        private eventEmitterService: EventEmitterService
    ) {
        this.eventEmitterService.onChangePage('Adverts');
        this.dataSource = new MatTableDataSource;
        this.eventEmitterService.onChangePage('Bids');
        // this.user = JSON.parse(localStorage.getItem('user'));
        this.loading = true;
        this.displayedColumns = ['cud', 'loadDescription', 'vehicleDescription', 'driverDescription', 'price', 'statusDescription'];
    }

    ngOnInit(): void {
        this.eventEmitterService.onChangePage('My Bids');
        this.route.queryParams.subscribe(params => {
            if (params['action'] == 'return') {
                //console.log('now');
            }
        });

        this.getLoads();
        this.getVehicles();
        this.getDrivers();
        this.getBids();
    }

    getBids() {
        this.subscriptionBids = this.bidService.getBids().subscribe(bidList => {
            console.log('bidList', bidList);
            this.bidList = bidList;
            this.dataSource.data = this.bidList;
            this.dataSource.paginator = this.paginatorBid;
            this.dataSource.sort = this.sortBid;
        });
    }
    getLoads() {
        this.subscriptionLoads = this.loadService.getLoads().subscribe(loadList => {
            this.loadList = loadList;
        });
    }
    getVehicles() {
        this.subscriptionVehicles = this.vehicleService.getVehicles().subscribe(vehicleList => {
            this.vehicleList = vehicleList;
        });
    }
    getDrivers() {
        this.subscriptionDrivers = this.driverService.getDrivers().subscribe(driverList => {
            this.driverList = driverList;
        });
    }

    showPaypal() {

        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'bids' };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        // const dialogRef = this.dialog.open(DialogPaypalComponent,
        //     dialogConfig);


        // dialogRef.afterClosed().subscribe(result => {
        //     //console.log(result);
        // });
    }

    initUpsert(row: any, readOnly: number) {
        this.form = this._formBuilder.group({

            userId: [row == null ? localStorage.getItem('userId') : row.userId],
            loadId: [{ value: row == null ? null : row.loadId, disabled: readOnly == 1 }, Validators.required],
            loadDescription: [row == null ? null : row.loadDescription],
            vehicleId: [{ value: row == null ? null : row.vehicleId, disabled: readOnly == 1 }, Validators.required],
            vehicleDescription: [row == null ? null : row.vehicleDescription],
            driverId: [{ value: row == null ? null : row.driverId, disabled: readOnly == 1 }, Validators.required],
            driverDescription: [row == null ? null : row.driverDescription],
            price: [{ value: row == null ? null : row.price, disabled: readOnly == 1 }, Validators.required],
            dateOut: [{ value: row == null ? null : row.dateOut, disabled: readOnly == 1 }, Validators.required],
            dateIn: [{ value: row == null ? null : row.dateIn, disabled: readOnly == 1 }, Validators.required],
            statusId: [row == null ? 'B3B7D04D-64B7-4ED7-BFE1-CF06D2B4A8AB' : row.statusId],
            statusDescription: [row == null ? null : row.statusDescription],
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
                if (row == null) {
                    this.bidService.createBid(result.form, result.fileToUpload).then((apiResult: any) => {
                    });
                } else {
                    this.bidService.updateBids(result.form, result.fileToUpload).then((apiResult: any) => {
                    });
                }
            }
        });
    }
    async initDelete(id: any, avatar: string) {
        const cont = await Dialog.confirm({
            title: 'Confirm',
            message: `Are you sure you want to delete this item?`,
        });

        if (cont.value) {
            this.loading = true;
            this.bidService.deleteBid(id).then((apiResult: any) => {
                this.bidList.splice(this.bidList.findIndex(item => item.id === id), 1);
                this.dataSource = new MatTableDataSource(this.bidList);
                this.loading = false;
            });
        }
    }

    updateStatus(row: any, status: string) {
        if (status === 'Delivered' || status === 'Completed') {
            this.initRating(row, 'Load', status);
        } else {
            this.loading = true;
            // this.apiService.createItem('loads', 'status', { id: row.loadId, description: status }).then((apiResult: any) => {
            //     this.getBids().then(getBidsResult => {
            //         this.dataSource = new MatTableDataSource(getBidsResult);
            //         this.loading = false;
            //     });
            //     this.loading = false;
            // });
        }
    }


    initRating(row: any, reviewType: string, status: string) {
        this.form = this._formBuilder.group({
            loadId: [row.id],
            userId: [row.userId],
            ratingPunctuality: [0],
            ratingVehicleDescription: [0],
            ratingLoadDescription: [0],
            ratingCare: [0],
            ratingCondition: [0],
            ratingPayment: [0],
            ratingAttitude: [0],
            note: ['']
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            reviewType: reviewType,
            title: 'Add'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogReviewComponent,
            dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.loading = true;
                // this.apiService.createItem('reviewLoads', { loadId: row.loadId, ratingPunctuality: result.ratingPunctuality, ratingLoadDescription: result.ratingLoadDescription, ratingPayment: result.ratingPayment, ratingCare: result.ratingCare, ratingAttitude: result.ratingAttitude, note: result.note }).subscribe((apiResult: any) => {
                //     // this.apiService.createItem('loads', 'status', { id: row.loadId, description: status }).then((apiResult: any) => {
                //     //     this.getBids().then(getBidsResult => {
                //     //         this.dataSource = new MatTableDataSource(getBidsResult);
                //     //         this.loading = false;
                //     //     });
                //     //     this.loading = false;
                //     // });
                // });
            }
        });
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    onRatingChanged(rating: number) {
    }

    ngOnDestroy() {
        this.subscriptionBids.unsubscribe();
        this.subscriptionDrivers.unsubscribe();
        this.subscriptionLoads.unsubscribe();
        this.subscriptionVehicles.unsubscribe();
    }
}
