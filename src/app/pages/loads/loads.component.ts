import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ApiService } from 'src/app/services/api.service';
import { load } from 'src/app/models/load.model';

import { Subscription, first } from 'rxjs';
import { DialogLoadComponent } from 'src/app/dialogs/dialog-load/dialog-load.component';
// import { UploadService } from 'src/app/shared/upload.service';
// import { upload } from 'src/app/models/upload';
import * as L from 'leaflet';
import { vehicle } from 'src/app/models/vehicle.model';
import { driver } from 'src/app/models/driver.model';
import { VariableService } from 'src/app/services/variable.service';
import { DialogBidListComponent } from 'src/app/dialogs/dialog-bid-list/dialog-bid-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { notification } from 'src/app/models/notification.model';
import { status } from 'src/app/models/status.model';

import { DialogReviewComponent } from 'src/app/dialogs/dialog-review/dialog-review.component';
import { loadCategory } from 'src/app/models/loadCategory.model';
import { loadType } from 'src/app/models/loadType.model';
import { HttpEventType } from '@angular/common/http';
import { user } from 'src/app/models/user.model';
// import { DialogPaypalComponent } from 'src/app/dialogs/dialog-paypal/dialog-paypal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Dialog } from '@capacitor/dialog';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { LoadService } from './loads.service';
import { LoadCategoryService } from '../lookups/loadCategories.service';
import { LoadTypeService } from '../lookups/loadTypes.service';
import { VehicleService } from '../vehicles/vehicle.service';
import { DriverService } from '../drivers/driver.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';

const MAX_SIZE: number = 1048576;

@Component({
    selector: 'loads',
    templateUrl: './loads.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoadsComponent implements OnInit, OnDestroy {
    timestamp: number = 0;
    loading: boolean = true;
    rangeItems: any[] = [
        { description: '10km', value: 10 },
        { description: '50km', value: 50 },
        { description: '100km', value: 100 },
        { description: '500km', value: 500 },
        { description: 'ALL', value: 100000 }
    ]
    range: number = 50;
    user!: User;

    form!: FormGroup;
    displayedColumns: string[];
    dataSource!: MatTableDataSource<load>;
    @ViewChild(MatPaginator, { static: false }) paginatorLoad!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortLoad!: MatSort;


    theFile: any = null;
    messages: string[] = [];

    loadList: load[] = [];
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loadCategoryList: loadCategory[] = [];
    loadTypeList: loadType[] = [];
    deleteform!: FormGroup;

    quantity: number = Number(localStorage.getItem('loadsQuantity'));

    subscriptionLoads!: Subscription;
    subscriptionLoadCategories!: Subscription;
    subscriptionLoadTypes!: Subscription;
    subscriptionVehicles!: Subscription;
    subscriptionDrivers!: Subscription;

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
        private userService: UserService,
        private loadService: LoadService,
        private loadCategoryService: LoadCategoryService,
        private loadTypeService: LoadTypeService,
        private vehicleService: VehicleService,
        private driverService: DriverService,
        private route: ActivatedRoute,
        private eventEmitterService: EventEmitterService
    ) {
        this.eventEmitterService.onChangePage('Loads');

        this.loading = false;
        this.dataSource = new MatTableDataSource;
        this.displayedColumns = this.getDisplayedColumns();//this.displayedColumns = ['cud', 'description', 'originatingAddressLabel', 'destinationAddressLabel', 'dateOut', 'weight', 'statusDescription', 'bidCount'];

        this.userService.get().subscribe(data => {
            this.user = data!;
            console.log(data);
        })
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['action'] == 'return') {
                //console.log('now');
            }
        });

        GlobalConstants.pageSelected = 'Loads';
        this.getLoadCategories();
        this.getLoadTypes();
        this.getVehicles();
        this.getDrivers();
        this.getLoads();
    }

    getLoads() {
        this.subscriptionLoads = this.loadService.getLoads().subscribe(loadList => {
            console.log('loadList', loadList);
            this.loadList = loadList;
            this.dataSource.data = this.loadList;
            this.dataSource.paginator = this.paginatorLoad;
            this.dataSource.sort = this.sortLoad;
        });
    }

    getLoadTypes() {
        this.subscriptionLoadTypes = this.loadTypeService.getLoadTypes().subscribe(loadTypeList => {
            this.loadTypeList = loadTypeList;
        });
    }
    getLoadCategories() {
        this.subscriptionLoadCategories = this.loadCategoryService.getLoadCategories().subscribe(loadCategoryList => {
            this.loadCategoryList = loadCategoryList;
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
        dialogConfig.data = { page: 'loads' };

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

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?: any) {
        this.displayedColumns = this.getDisplayedColumns();
    }
    getDisplayedColumns() {
        return window.innerWidth > 1000 ? ['cud', 'bidCount', 'description', 'originatingAddressLabel', 'destinationAddressLabel', 'dateOut', 'weight', 'statusDescription'] : ['cud', 'bidCount', 'description', 'destinationAddressLabel', 'dateOut', 'statusDescription'];
    }

    async initUpsert(row: any) {
        if (1 == 1 || this.dataSource.data.length < this.quantity || this.quantity === -1 || row !== null) {
            this.form = this._formBuilder.group({
                id: [row == null ? undefined : row.id],
                userId: [row == null ? this.user.uid : row.userId],
                loadCategoryId: [row == null ? null : row.loadCategoryId],
                loadTypeId: [row == null ? 'XJ4zUU4LXt4KOzctKmqS' : row.loadTypeId, Validators.required],
                loadTypeDescription: [row == null ? 'EB' : row.loadTypeDescription],
                description: [row == null ? '1' : row.description, Validators.required],
                note: [row == null ? '1' : row.note, Validators.required],
                price: [row == null ? '1' : row.price, Validators.required],
                originatingAddressLabel: [row == null ? '1' : row.originatingAddressLabel, Validators.required],
                originatingAddressLat: [row == null ? '1' : row.originatingAddressLat, Validators.required],
                originatingAddressLon: [row == null ? '1' : row.originatingAddressLon, Validators.required],
                destinationAddressLabel: [row == null ? '1' : row.destinationAddressLabel, Validators.required],
                destinationAddressLat: [row == null ? '1' : row.destinationAddressLat, Validators.required],
                destinationAddressLon: [row == null ? '1' : row.destinationAddressLon, Validators.required],
                itemCount: [row == null ? '1' : row.itemCount, Validators.required],
                weight: [row == null ? '1' : row.weight, Validators.required],
                length: [row == null ? '1' : row.length, Validators.required],
                width: [row == null ? '1' : row.width, Validators.required],
                height: [row == null ? '1' : row.height, Validators.required],
                volume: [row == null ? '1' : row.volume, Validators.required],
                totalValue: [row == null ? '1' : row.totalValue, Validators.required],
                dateOut: [row == null ? '2022-01-01 12:00' : new Date(row.dateOut.seconds * 1000), Validators.required],
                dateIn: [row == null ? '2022-01-01 12:00' : new Date(row.dateIn.seconds * 1000), Validators.required],
                dateBidEnd: [row == null ? '2022-01-01 12:00' : new Date(row.dateBidEnd.seconds * 1000), Validators.required],
                avatar: [row == null ? null : row.avatar],
                statusId: [row == null ? '7FD7D57C-C4FD-4A7C-A0C7-B4FBADFB0112' : row.statusId],
                statusDescription: [row == null ? null : row.statusDescription]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                loadCategoryList: this.loadCategoryList,
                loadTypeList: this.loadTypeList,
                originatingAddressLabel: row == null ? null : row.originatingAddressLabel,
                originatingAddressLat: row == null ? null : row.originatingAddressLat,
                originatingAddressLon: row == null ? null : row.originatingAddressLon,
                destinationAddressLabel: row == null ? null : row.destinationAddressLabel,
                destinationAddressLat: row == null ? null : row.destinationAddressLat,
                destinationAddressLon: row == null ? null : row.destinationAddressLon,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "800px";

            const dialogRef = this.dialog.open(DialogLoadComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                console.log('result', result);
                if (result !== false) {
                    //this.loading = true;
                    if (row == null) {
                        this.loadService.createLoad(result.form).then((apiResult: any) => {
                            console.log(apiResult);
                        });
                    } else {
                        this.loadService.updateLoads(result.form).then((apiResult: any) => {
                            console.log(apiResult);
                        });
                    }
                }
            });
        } else {
            this.showPaypal();
        }
    }
    async initDelete(id: any, avatar: string) {
        const cont = await Dialog.confirm({
            title: 'Confirm',
            message: `Are you sure you want to delete this item?`,
        });

        if (cont.value) {
            this.loading = true;
            this.loadService.deleteLoad(id).then((apiResult: any) => {
                this.loadList.splice(this.loadList.findIndex(item => item.id === id), 1);
                this.dataSource = new MatTableDataSource(this.loadList);
                this.loading = false;
            });
        }
    }

    initRating(row: any, reviewType: string, status: any) {
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
                // this.apiService.post('reviewDrivers', null, { loadId: row.id, ratingPunctuality: result.ratingPunctuality, ratingVehicleDescription: result.ratingVehicleDescription, ratingCare: result.ratingCare, ratingCondition: result.ratingCondition, ratingAttitude: result.ratingAttitude, note: result.note }).subscribe({
                //     next: (apiResult: any) => {
                //         if (apiResult.result == true) {
                //             this.apiService.post('loads', 'status', { id: row.id, description: status, userIdAccepted: row.userIdAccepted, userIdLoaded: row.userIdLoaded, userIdLoadedConfirmed: row.userIdLoadedConfirmed, userIdDelivered: row.userIdDelivered, userIdDeliveredConfirmed: row.userIdDeliveredConfirmed }).subscribe({
                //                 next: (apiResult: any) => {
                //                     if (apiResult.result == true) {
                //                         this.getLoads().then(getLoadsResult => {
                //                             this.dataSource = new MatTableDataSource(getLoadsResult);
                //                             this.loading = false;
                //                         });
                //                     } else {
                //                         if (apiResult.message == 'Expired') {
                //                             this._router.navigate(['/sign-out']);
                //                         } else {
                //                             //console.log(apiResult);
                //                             this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                //                             this.loading = false;
                //                         }
                //                     }
                //                 },
                //                 error: (error: string) => {
                //                     console.log(error);
                //                     this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                //                     this.loading = false;
                //                 },
                //                 complete: () => {
                //                     //console.log('Done');
                //                 }
                //             });
                //         } else {
                //             if (apiResult.message == 'Expired') {
                //                 this._router.navigate(['/sign-out']);
                //             } else {
                //                 //console.log(apiResult);
                //                 this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                //                 this.loading = false;
                //             }
                //         }
                //     },
                //     error: (error: string) => {
                //         console.log(error);
                //         this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                //         this.loading = false;
                //     },
                //     complete: () => {
                //         //console.log('Done');
                //     }
                // });
            }
        });
    }

    viewBids(row: any) {
        this.form = this._formBuilder.group({

            userId: [row == null ? localStorage.getItem('userId') : row.userId],
            loadCategoryId: [row == null ? null : row.loadCategoryId],
            loadTypeId: [row == null ? null : row.loadTypeId, Validators.required],
            loadTypeDescription: [row == null ? null : row.loadTypeDescription, Validators.required],
            description: [row == null ? null : row.description, Validators.required],
            note: [row == null ? null : row.note, Validators.required],
            price: [row == null ? null : row.price, Validators.required],
            originatingAddressLabel: [row == null ? null : row.originatingAddressLabel, Validators.required],
            originatingAddressLat: [row == null ? null : row.originatingAddressLat, Validators.required],
            originatingAddressLon: [row == null ? null : row.originatingAddressLon, Validators.required],
            destinationAddressLabel: [row == null ? null : row.destinationAddressLabel, Validators.required],
            destinationAddressLat: [row == null ? null : row.destinationAddressLat, Validators.required],
            destinationAddressLon: [row == null ? null : row.destinationAddressLon, Validators.required],
            itemCount: [row == null ? null : row.itemCount, Validators.required],
            weight: [row == null ? null : row.weight, Validators.required],
            length: [row == null ? null : row.length, Validators.required],
            width: [row == null ? null : row.width, Validators.required],
            height: [row == null ? null : row.height, Validators.required],
            totalValue: [row == null ? null : row.totalValue, Validators.required],
            dateOut: [row == null ? null : new Date(row.dateOut.seconds * 1000), Validators.required],
            dateIn: [row == null ? null : new Date(row.dateIn.seconds * 1000), Validators.required],
            dateBidEnd: [row == null ? null : new Date(row.dateBidEnd.seconds * 1000), Validators.required],
            avatar: [row == null ? null : row.avatar],
            avatarChanged: [false],
            statusId: [row == null ? '7FD7D57C-C4FD-4A7C-A0C7-B4FBADFB0112' : row.statusId]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            loadId: row.id,
            item: row,
            form: this.form,
            loadList: this.loadList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            originatingAddressLabel: row == null ? null : row.originatingAddressLabel,
            originatingAddressLat: row == null ? null : row.originatingAddressLat,
            originatingAddressLon: row == null ? null : row.originatingAddressLon,
            destinationAddressLabel: row == null ? null : row.destinationAddressLabel,
            destinationAddressLat: row == null ? null : row.destinationAddressLat,
            destinationAddressLon: row == null ? null : row.destinationAddressLon,
            title: 'View'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogBidListComponent,
            dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            //if (result !== false) {
            // this.loading = true;
            // this.getLoads().then(getLoadResult => {
            //     this.dataSource = new MatTableDataSource(getLoadResult);
            //     this.loading = false;
            // });
            //}
        });
    }

    updateStatus(row: any, status: string) {
        if (status === 'Delivered' || status === 'Completed') {
            this.initRating(row, 'Driver', status);
        } else {
            this.loading = true;
            // this.apiService.createItem('loads', 'status', { id: row.id, description: status, userIdAccepted: row.userIdAccepted, userIdLoaded: row.userIdLoaded, userIdLoadedConfirmed: row.userIdLoadedConfirmed, userIdDelivered: row.userIdDelivered, userIdDeliveredConfirmed: row.userIdDeliveredConfirmed }).subscribe({
            //     next: (apiResult: any) => {
            //         if (apiResult.result == true) {
            //             this.getLoads().then(getLoadsResult => {
            //                 this.dataSource = new MatTableDataSource(getLoadsResult);
            //                 this.loading = false;
            //             });
            //         } else {
            //             if (apiResult.message == 'Expired') {
            //                 this._router.navigate(['/sign-out']);
            //             } else {
            //                 //console.log(apiResult);
            //                 this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
            //                 this.loading = false;
            //             }
            //         }
            //     },
            //     error: (error: string) => {
            //         console.log(error);
            //         this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
            //         this.loading = false;
            //     },
            //     complete: () => {
            //         //console.log('Done');
            //     }
            // });
        }
    }

    uploadFile(fileToUpload: string | Blob, filename: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                // this.apiService.upload('loads', formData, filename).subscribe(event => {
                //     if (event.type === HttpEventType.Response) {
                //         resolve(true);
                //     }
                // })
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    ngOnDestroy() {
        this.subscriptionDrivers.unsubscribe();
        this.subscriptionLoadCategories.unsubscribe();
        this.subscriptionLoadTypes.unsubscribe();
        this.subscriptionLoads.unsubscribe();
        this.subscriptionVehicles.unsubscribe();
    }
}
