import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// import { ApiService } from 'src/app/services/api.service';
import { vehicle } from 'src/app/models/vehicle.model';

import { first, map } from 'rxjs';
import { DialogVehicleComponent } from 'src/app/dialogs/dialog-vehicle/dialog-vehicle.component';
import { VariableService } from 'src/app/services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { vehicleCategory } from 'src/app/models/vehicleCategory.model';
import { vehicleType } from 'src/app/models/vehicleType.model';
import { status } from 'src/app/models/status.model';

import { HttpEventType } from '@angular/common/http';
// import { DialogPaypalComponent } from 'src/app/dialogs/dialog-paypal/dialog-paypal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Dialog } from '@capacitor/dialog';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { VehicleService } from 'src/app/pages/vehicles/vehicle.service';

import { Subscription } from 'rxjs';
import { StatusService } from 'src/app/services/status.service';
import { VehicleTypeService } from '../lookups/vehicleTypes.service';
import { VehicleCategoryService } from '../lookups/vehicleCategories.service';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from 'src/app/shared/global-constants';


const MAX_SIZE: number = 1048576;

@Component({
    selector: 'vehicles',
    templateUrl: './vehicles.component.html',
    encapsulation: ViewEncapsulation.None
})
export class VehiclesComponent implements OnInit, OnDestroy {
    user:any = JSON.parse(localStorage.getItem('user')!);
    //imageFolder:string = environment.imageReference.replace('_b_', environment.firebase.storageBucket).replace('_t_', localStorage.getItem('token')!);
    subscriptionVehicles!: Subscription;
    subscriptionVehicleCategories!: Subscription;
    subscriptionVehicleTypes!: Subscription;
    timestamp: number = 0;
    //loading: boolean = true;
    form!: FormGroup;
    vehicleList: vehicle[] = [];
    statusList: status[] = [];

    displayedColumns: string[];
    dataSource!: MatTableDataSource<vehicle>;
    @ViewChild(MatPaginator, { static: false }) paginatorVehicle!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortVehicle!: MatSort;

    vehicleCategoryList: vehicleCategory[] = [];
    vehicleTypeList: vehicleType[] = [];

    theFile: any = null;
    messages: string[] = [];

    deleteform!: FormGroup;

    quantity: number = Number(localStorage.getItem('vehiclesQuantity'));

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        // private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        public vehicleService: VehicleService,
        public vehicleCategoryService: VehicleCategoryService,
        public vehicleTypeService: VehicleTypeService,
        public statusService: StatusService,
        private _router: Router,
        private route: ActivatedRoute,
        private eventEmitterService: EventEmitterService
    ) {
        this.eventEmitterService.onChangePage('Vehicles');
        // this.loading = true;
        this.dataSource = new MatTableDataSource;
        this.displayedColumns = ['cud', 'avatar', 'vehicleTypeDescription', 'availableFrom', 'availableTo'];
    }

    ngOnInit(): void {
        this.eventEmitterService.onChangePage('My Vehicles');
        this.route.queryParams.subscribe(params => {
            if (params['action'] == 'return') {
                //console.log('now');
            }
        });

        this.getVehicles();
        // this.getStatusses();
        this.getVehicleCategories();
        this.getVehicleTypes();
    }

    getVehicles() {
        this.subscriptionVehicles = this.vehicleService.getVehicles().subscribe(vehicleList => {
            this.vehicleList = vehicleList;
            this.dataSource.data = this.vehicleList;
            this.dataSource.paginator = this.paginatorVehicle;
            this.dataSource.sort = this.sortVehicle;
        });
    }
    // getStatusses() {
    //     this.subscriptionVehicles = this.vehicleService.getVehicles().subscribe(vehicleList => {
    //         this.vehicleList = vehicleList;
    //         this.dataSource.data = this.vehicleList;
    //         this.dataSource.paginator = this.paginatorVehicle;
    //         this.dataSource.sort = this.sortVehicle;
    //         console.log(vehicleList);
    //     });
    // }
    getVehicleCategories() {
        this.subscriptionVehicleCategories = this.vehicleCategoryService.getVehicleCategories().subscribe(list => {
            this.vehicleCategoryList = list;
        });
    }
    getVehicleTypes() {
        this.subscriptionVehicleTypes = this.vehicleTypeService.getVehicleTypes().subscribe(list => {
            this.vehicleTypeList = list;
        });
    }

    // getVehicles(): Promise<vehicle[]> {
    //     var promise = new Promise<vehicle[]>((resolve) => {
    //         try {
    //             this.apiService.getItems('vehicles').subscribe((apiResult: any) => {
    //                 resolve(apiResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }

    // getVehicleCategories(): Promise<vehicleCategory[]> {
    //     var promise = new Promise<vehicleCategory[]>((resolve) => {
    //         try {
    //             this.apiService.getItems('vehicleCategories').subscribe((apiResult: any) => {
    //                 resolve(apiResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }

    // getVehicleTypes(): Promise<vehicleType[]> {
    //     var promise = new Promise<vehicleType[]>((resolve) => {
    //         try {
    //             this.apiService.getItems('vehicleTypes').subscribe((apiResult: any) => {
    //                 resolve(apiResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }

    // getStatusses(): Promise<status[]> {
    //     var promise = new Promise<status[]>((resolve) => {
    //         try {
    //             this.apiService.getItems('status').subscribe((apiResult: any) => {
    //                 resolve(apiResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }

    showPaypal() {

        // this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'vehicles' };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        // const dialogRef = this.dialog.open(DialogPaypalComponent,
        //     dialogConfig);


        // dialogRef.afterClosed().subscribe(result => {
        //     console.log(result);
        // });
    }

    initUpsert(row: any) {
        if (1 == 1 || this.dataSource.data.length < this.quantity || this.quantity === -1 || row !== null) {
            this.form = this._formBuilder.group({
                id: [row == null ? undefined : row.id],
                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                vehicleCategoryId: [row == null ? null : row.vehicleCategoryId],
                vehicleTypeId: [row == null ? null : row.vehicleTypeId, Validators.required],
                vehicleTypeDescription: [row == null ? null : row.vehicleTypeDescription],
                description: [row == null ? null : row.description, Validators.required],
                registrationNumber: [row == null ? null : row.registrationNumber, Validators.required],
                maxLoadWeight: [row == null ? null : row.maxLoadWeight, Validators.required],
                maxLoadHeight: [row == null ? null : row.maxLoadHeight, Validators.required],
                maxLoadWidth: [row == null ? null : row.maxLoadWidth, Validators.required],
                maxLoadLength: [row == null ? null : row.maxLoadLength, Validators.required],
                maxLoadVolume: [row == null ? null : row.maxLoadVolume, Validators.required],
                availableCapacity: [row == null ? null : row.availableCapacity, Validators.required],
                availableFrom: [row == null ? null : row.availableFrom ? row.availableFrom.seconds ? new Date(row.availableFrom.seconds * 1000) : new Date(row.availableFrom) : null, Validators.required],
                availableTo: [row == null ? null : row.availableTo ? row.availableTo.seconds ? new Date(row.availableTo.seconds * 1000) : new Date(row.availableTo) : null, Validators.required],
                originatingAddressLabel: [row == null ? null : row.originatingAddressLabel, Validators.required],
                originatingAddressLat: [row == null ? null : row.originatingAddressLat, Validators.required],
                originatingAddressLon: [row == null ? null : row.originatingAddressLon, Validators.required],
                destinationAddressLabel: [row == null ? null : row.destinationAddressLabel],
                destinationAddressLat: [row == null ? null : row.destinationAddressLat],
                destinationAddressLon: [row == null ? null : row.destinationAddressLon],
                avatar: [row == null ? null : row.avatar],
                statusId: [row == null ? null : row.statusId],
                statusDescription: [row == null ? null : row.statusDescription]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                vehicleCategoryList: this.vehicleCategoryList,
                vehicleTypeList: this.vehicleTypeList,
                statusList: this.statusList,
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

            const dialogRef = this.dialog.open(DialogVehicleComponent,
                dialogConfig);


            dialogRef.afterClosed().subscribe(result => { 
                console.log('result', result);
                if (result !== false) {
                    // this.loading = true;
                    if (row == null) {
                        this.vehicleService.createVehicle(result.form,result.fileToUpload).then((apiResult: any) => {
                        });
                    } else {
                        this.vehicleService.updateVehicles(result.form,result.fileToUpload).then((apiResult: any) => {
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
            this.vehicleService.deleteVehicle(id).then((apiResult: any) => {
            });
        }
    }
    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    ngOnDestroy() {
        this.subscriptionVehicles.unsubscribe();
        this.subscriptionVehicleCategories.unsubscribe();
        this.subscriptionVehicleTypes.unsubscribe();
    }
}
