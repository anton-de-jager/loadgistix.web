import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { advert } from 'src/app/models/advert.model';
import { first } from 'rxjs';
import { DialogAdvertComponent } from 'src/app/dialogs/dialog-advert/dialog-advert.component';
import { VariableService } from 'src/app/services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { advertPackage } from 'src/app/models/advertPackage.model';
import { status } from 'src/app/models/status.model';
import { HttpEventType } from '@angular/common/http';
import { user } from 'src/app/models/user.model';
// import { DialogPaypalComponent } from 'src/app/dialogs/dialog-paypal/dialog-paypal.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Dialog } from '@capacitor/dialog';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Subscription } from 'rxjs';
import { AdvertService } from './advert.service';
import { AdvertPackageService } from './advertPackage.service';

const MAX_SIZE: number = 1048576;

@Component({
    selector: 'adverts',
    templateUrl: './adverts.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdvertsComponent implements OnInit, OnDestroy {
    timestamp: number = 0;
    loading: boolean = true;
    form!: FormGroup;
    advertList: advert[] = [];
    user!: user;

    displayedColumns: string[];
    dataSource!: MatTableDataSource<advert>;
    @ViewChild(MatPaginator, { static: false }) paginatorAdvert!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortAdvert!: MatSort;

    advertPackageList: advertPackage[] = [];

    theFile: any = null;
    messages: string[] = [];

    deleteform!: FormGroup;

    quantity: number = Number(localStorage.getItem('advertsQuantity'));

    subscriptionAdvertPackages!: Subscription;
    subscriptionAdverts!: Subscription;

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
        private advertService: AdvertService,
        private advertPackageService: AdvertPackageService,

        private route: ActivatedRoute,
        private eventEmitterService: EventEmitterService
    ) {
        this.eventEmitterService.onChangePage('Adverts');
        this.dataSource = new MatTableDataSource;
        // this.user = JSON.parse(localStorage.getItem('user'));
        this.timestamp = new Date().getTime();
        this.loading = true;
        this.displayedColumns = ['cud', 'title', 'avatar', 'statusDescription'];
    }

    ngOnInit(): void {
        this.eventEmitterService.onChangePage('My Adverts');
        this.route.queryParams.subscribe(params => {
            if (params['action'] == 'return') {
                //console.log('now');
            }
        });

        this.getAdvertPackages();
        this.getAdverts();
    }

    getAdverts() {
        this.subscriptionAdverts = this.advertService.getAdverts().subscribe(advertList => {
            console.log('advertList', advertList);
            this.advertList = advertList;
            this.dataSource.data = this.advertList;
            this.dataSource.paginator = this.paginatorAdvert;
            this.dataSource.sort = this.sortAdvert;
        });
    }
    getAdvertPackages() {
        this.subscriptionAdvertPackages = this.advertPackageService.getAdvertPackages().subscribe(advertPackageList => {
            console.log('advertPackageList', advertPackageList);
            this.advertPackageList = advertPackageList;
        });
    }

    showPaypal() {

        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'adverts' };

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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    initUpsert(row: any) {
        if (1 == 1 || this.dataSource.data.length < this.quantity || this.quantity === -1 || row !== null) {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            var c = new Date(year + 1, month, day);

            this.form = this._formBuilder.group({

                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                dateExpiry: [row == null ? c : row.dateExpiry],
                advertPackageId: [row == null ? null : row.advertPackageId, Validators.required],
                advertPackageDescription: [row == null ? null : row.advertPackageDescription],
                title: [row == null ? null : row.title, [Validators.required, Validators.maxLength(30)]],
                subTitle: [row == null ? null : row.subTitle, [Validators.required, Validators.maxLength(50)]],
                link: [row == null ? null : row.link, [Validators.required, Validators.maxLength(200)]],
                content: [row == null ? null : row.content, [Validators.required, Validators.maxLength(200)]],
                avatar: [row == null ? null : row.avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                statusId: [row == null ? '490039A9-3DD3-4265-B998-FB735E2A233C' : row.statusId],
                statusDescription: [row == null ? null : row.statusDescription]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                advertPackageList: this.advertPackageList,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "800px";

            const dialogRef = this.dialog.open(DialogAdvertComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.loading = true;
                    if (row == null) {
                        this.advertService.createAdvert(result.form, result.fileToUpload).then((apiResult: any) => {
                        });
                    } else {
                        this.advertService.updateAdverts(result.form, result.fileToUpload).then((apiResult: any) => {
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
            this.advertService.deleteAdvert(id).then((apiResult: any) => {
                this.advertList.splice(this.advertList.findIndex(item => item.id === id), 1);
                this.dataSource = new MatTableDataSource(this.advertList);
                this.loading = false;
            });
        }
    }

    uploadFile(fileToUpload: string | Blob, filename: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                // this.apiService.upload('adverts', formData, filename).subscribe(event => {
                //     if (event.type === HttpEventType.Response) {
                resolve(true);
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
        this.subscriptionAdverts.unsubscribe();
        this.subscriptionAdvertPackages.unsubscribe();
    }
}
