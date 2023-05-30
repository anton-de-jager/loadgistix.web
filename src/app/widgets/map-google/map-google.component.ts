import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from '.'./.'./app-routing.module';
// import { AppComponent } from '.'./.'./app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { environment } from '.'./.'./dialogs/dialog-advert'

import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
// import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from "@angular/fire/compat/auth";
import { provideDatabase, getDatabase, list } from '@angular/fire/database';
import { provideFirestore, getFirestore, and } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
// import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
// import { SharedModule } from "'./shared/shared.module";
import { EventEmitterService } from '.'./.'./services/event-emitter.service';
import { UserService } from '.'./.'./services/user.service';
import { ApiFireService } from '.'./.'./services/api-fire.service';
import { ApiService } from '.'./.'./services/api.service';
import { VariableService } from '.'./.'./services/variable.service';
import { MaterialModule } from '.'./.'./shared/material.module';
import { AdvertComponent } from '.'./.'./widgets/advert/advert.component';
// import { DriverService } from '.'./.'./pages/drivers/driver.service';
// import { VehicleService } from '.'./.'./pages/vehicles/vehicle.service';
// import { LoadService } from '.'./.'./pages/loads/loads.service';
// import { VehicleTypeService } from '.'./.'./pages/lookups/vehicleTypes.service';
// import { VehicleCategoryService } from '.'./.'./pages/lookups/vehicleCategories.service';
// import { LoadTypeService } from '.'./.'./pages/lookups/loadTypes.service';
// import { LoadCategoryService } from '.'./.'./pages/lookups/loadCategories.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
// import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
// import { HomeComponent } from ''./pages/home/home.component';

import { CommonModule } from '@angular/common';

import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GoogleMapsModule } from '@angular/google-maps';
// import { NgChartsModule } from 'ng2-charts';

// import { ProfileComponent } from '.'./.'./pages/profile/profile.component';
// import { MapMapboxComponent } from ''./pages/map-mapbox/map-mapbox.component';
// import { MapGoogleComponent } from ''./pages/map-google/map-google.component';
// import { MapLeafletComponent } from ''./pages/map-leaflet/map-leaflet.component';
// import { LookupsComponent } from ''./pages/lookups/lookups.component';
// import { VehiclesComponent } from ''./pages/vehicles/vehicles.component';
// import { DriversComponent } from ''./pages/drivers/drivers.component';
// import { LoadsComponent } from ''./pages/loads/loads.component';
// import { BidsComponent } from ''./pages/bids/bids.component';
// import { AdvertsComponent } from ''./pages/adverts/adverts.component';
// import { DirectoriesComponent } from ''./pages/directories/directories.component';
// import { BusinessDirectoryComponent } from ''./pages/business-directory/business-directory.component';
// import { DialogImageUploadComponent } from ''./dialogs/dialog-image-upload/dialog-image-upload.component';
// import { DialogInfoComponent } from ''./dialogs/dialog-info/dialog-info.component';
// import { FacebookSigninDirective } from ''./directives/facebook-signin.directive';
// import { GoogleSigninDirective } from ''./directives/google-signin.directive';
// import { TwitterSigninDirective } from ''./directives/twitter-signin.directive';
// import { GithubSigninDirective } from ''./directives/github-signin.directive';
// import { PhoneSigninDirective } from ''./directives/phone-signin.directive';
// import { EmailSigninDirective } from ''./directives/email-signin.directive';
// import { DashboardComponent } from ''./pages/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { DialogVehicleCategoryComponent } from ''./dialogs/dialog-vehicleCategory/dialog-vehicleCategory.component';
// import { DialogLoadCategoryComponent } from ''./dialogs/dialog-loadCategory/dialog-loadCategory.component';
// import { DialogLoadTypeComponent } from ''./dialogs/dialog-loadType/dialog-loadType.component';
// import { DialogVehicleTypeComponent } from ''./dialogs/dialog-vehicleType/dialog-vehicleType.component';
// import { DialogAdvertComponent } from ''./dialogs/dialog-advert/dialog-advert.component';
// import { DialogBidComponent } from ''./dialogs/dialog-bid/dialog-bid.component';
// import { DialogDriverComponent } from ''./dialogs/dialog-driver/dialog-driver.component';
// import { DialogLoadComponent } from ''./dialogs/dialog-load/dialog-load.component';
// import { DialogVehicleComponent } from ''./dialogs/dialog-vehicle/dialog-vehicle.component';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import {
//   NgxMatDateFormats,
//   NgxMatDatetimePickerModule,
//   NgxMatNativeDateModule,
//   NgxMatTimepickerModule,
//   NGX_MAT_DATE_FORMATS
// } from '@angular-material-components/datetime-picker';
import { StarRatingComponent } from '.'./.'./widgets/star-rating/star-rating.component';
import { DialogAddressComponent } from '.'./.'./dialogs/dialog-address/dialog-address.component';
import { QRCodeModule } from 'angularx-qrcode';
import { DialogDirectoryComponent } from '.'./.'./dialogs/dialog-directory/dialog-directory.component';
import { DialogAppCodeComponent } from '.'./.'./dialogs/dialog-app-code/dialog-app-code.component';
import { DialogBidListComponent } from '.'./.'./dialogs/dialog-bid-list/dialog-bid-list.component';
import { LoadsAvailableComponent } from '.'./.'./pages/loads-available/loads-available.component';
import { DirectoryComponent } from '.'./..'./pages/directory/directory.component';
import { DialogQrCodeComponent } from '.'./.'./dialogs/dialog-qr-code/dialog-qr-code.component';
import { DialogReviewComponent } from ''./dialogs/dialog-review/dialog-review.component';
import { DialogAuthenticateComponent } from ''./dialogs/dialog-authenticate/dialog-authenticate.component';
import { PrivacyPolicyComponent } from ''./pages/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from ''./pages/terms-and-conditions/terms-and-conditions.component';
import { DialogLicenceTypeComponent } from ''./dialogs/dialog-licenceType/dialog-licenceType.component';

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ButtonRowComponent } from ''./widgets/button-row/button-row.component';
import { ButtonMenuRowComponent } from ''./widgets/button-menu-row/button-menu-row.component';
import { LayoutComponent } from ''./widgets/layout/layout.component';
import { AuthenticationComponent } from ''./pages/authentication/authentication.component';
import { FlipComponent } from ''./widgets/flip/flip.component';
import { FirestoreDatePipe } from ''./pipes/firestore-date-pipe';
import { SpinnerComponent } from ''./widgets/spinner/spinner.component';
import { LoadingInterceptor } from ''./guards/loading.interceptor';
import { getAuth, provideAuth, user } from '@angular/fire/auth';
import { MapComponent } from ''./widgets/map/map.component';
import { GoogleMapComponent } from ''./widgets/google-map/google-map.component';
import { LoadsAvaiableComponent } from ''import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { pipe, map } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { DialogAdvertComponent } from 'src/app/dialogs/dialog-advert/dialog-advert.component';
import { DialogBidComponent } from 'src/app/dialogs/dialog-bid/dialog-bid.component';
import { DialogDriverComponent } from 'src/app/dialogs/dialog-driver/dialog-driver.component';
import { DialogImageUploadComponent } from 'src/app/dialogs/dialog-image-upload/dialog-image-upload.component';
import { DialogInfoComponent } from 'src/app/dialogs/dialog-info/dialog-info.component';
import { DialogLoadComponent } from 'src/app/dialogs/dialog-load/dialog-load.component';
import { DialogLoadCategoryComponent } from 'src/app/dialogs/dialog-loadCategory/dialog-loadCategory.component';
import { DialogLoadTypeComponent } from 'src/app/dialogs/dialog-loadType/dialog-loadType.component';
import { DialogVehicleComponent } from 'src/app/dialogs/dialog-vehicle/dialog-vehicle.component';
import { DialogVehicleCategoryComponent } from 'src/app/dialogs/dialog-vehicleCategory/dialog-vehicleCategory.component';
import { DialogVehicleTypeComponent } from 'src/app/dialogs/dialog-vehicleType/dialog-vehicleType.component';
import { address } from 'src/app/models/address.model';
import { advert } from 'src/app/models/advert.model';
import { bid } from 'src/app/models/bid.model';
import { directory } from 'src/app/models/directory.model';
import { licenceType } from 'src/app/models/licenceType.model';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AdvertComponent,
    HomeComponent,
    MapComponent,
    GoogleMapComponent,
    
    FlipComponent,

    // //pages
    // DashboardComponent,
    // ProfileComponent,
    // MapMapboxComponent,
    // MapGoogleComponent,
    // MapLeafletComponent,
    // LookupsComponent,
    // VehiclesComponent,
    // DriversComponent,
    // LoadsComponent,
    // BidsComponent,
    // AdvertsComponent,
    // DirectoriesComponent,
    // BusinessDirectoryComponent,
    // LoadsAvailableComponent,
    // DirectoryComponent,
    // PrivacyPolicyComponent,
    // TermsAndConditionsComponent,

    //dialogs
    DialogAuthenticateComponent,
    DialogImageUploadComponent,
    DialogVehicleCategoryComponent,
    DialogVehicleTypeComponent,
    DialogLoadCategoryComponent,
    DialogLoadTypeComponent,
    DialogAdvertComponent,
    DialogBidComponent,
    DialogDriverComponent,
    DialogLoadComponent,
    DialogVehicleComponent,
    DialogAddressComponent,
    DialogDirectoryComponent,
    DialogAppCodeComponent,
    DialogBidListComponent,
    DialogQrCodeComponent,
    DialogReviewComponent,
    DialogLicenceTypeComponent,

    //widgets
    DialogInfoComponent,
    StarRatingComponent,

    //directives
    // FacebookSigninDirective,
    // GoogleSigninDirective,
    // TwitterSigninDirective,
    // GithubSigninDirective,
    // PhoneSigninDirective,
    // EmailSigninDirective,
    // ButtonRowComponent,
    // ButtonMenuRowComponent,
    // LayoutComponent,
    // AuthenticationComponent,

    //pipes
    FirestoreDatePipe,
     SpinnerComponent,
     LoadsAvaiableComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    NgxSkeletonLoaderModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    //AngularFireAuthModule,
    // provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    // provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    // providePerformance(() => getPerformance()),
    // provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),

 
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),   MatPasswordStrengthModule.forRoot(),

    // SharedModule,
    // MaterialModule,

    //material
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatSliderModule,
    MatMenuModule,
    MatRadioModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    MatNativeDateModule,
    NgxMatNativeDateModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
    MatBadgeModule,
    MatSelectModule,
    MatGridListModule,
    MatPaginatorModule,
    MatTableModule,
    MatOptionModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSortModule,

    CommonModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    ImageCropperModule,
    GoogleMapsModule,
    NgChartsModule,
    HttpClientModule,
    //MatMomentDateModule,
    QRCodeModule
  ],
  providers: [
    { provide: USE_AUTH_EMULATOR, useValue: !environment.production ? ['localhost', 4200] : undefined },
    ScreenTrackingService, UserTrackingService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
    EventEmitterService,
    UserService,
    ApiFireService,
    ApiService,
    VariableService,
    VehicleService,
    DriverService,
    LoadService,
    VehicleTypeService,
    VehicleCategoryService,
    LoadTypeService,
    LoadCategoryService,
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }
  ],
  exports:[
    ButtonRowComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
