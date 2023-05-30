import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertsComponent } from './pages/adverts/adverts.component';
import { BidsComponent } from './pages/bids/bids.component';
import { BusinessDirectoryComponent } from './pages/business-directory/business-directory.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DirectoriesComponent } from './pages/directories/directories.component';
import { DriversComponent } from './pages/drivers/drivers.component';
import { HomeComponent } from './pages/home/home.component';
import { LoadsComponent } from './pages/loads/loads.component';
import { LookupsComponent } from './pages/lookups/lookups.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
// import { AuthenticationGuard } from './guards/authentication.guard';
import { MapMapboxComponent } from './pages/map-mapbox/map-mapbox.component';
import { MapGoogleComponent } from './pages/map-google/map-google.component';
import { MapLeafletComponent } from './pages/map-leaflet/map-leaflet.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { LoadsAvailableComponent } from './pages/loads-available/loads-available.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

const redirectToLogin = redirectUnauthorizedTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'profile',
    canActivate: [canActivate],
    component: ProfileComponent,
  },
  {
    path: 'dashboard',
    canActivate: [canActivate],
    component: DashboardComponent,
  },
  {
    path: 'map-mapbox',
    canActivate: [canActivate],
    component: MapMapboxComponent,
  },
  {
    path: 'google-map',
    canActivate: [canActivate],
    component: MapGoogleComponent,
  },
  {
    path: 'leaflet-map',
    canActivate: [canActivate],
    component: MapLeafletComponent,
  },
  {
    path: 'admin',
    canActivate: [canActivate],
    redirectTo: '/lookups'
  },
  {
    path: 'lookups',
    canActivate: [canActivate],
    component: LookupsComponent,
  },
  // {
  //   path: 'settings',
  //   canActivate: [canActivate],
  //   component: SettingsComponent,
  // },
  {
    path: 'fleet',
    canActivate: [canActivate],
    redirectTo: '/vehicles'
  },
  {
    path: 'vehicles',
    canActivate: [canActivate],
    component: VehiclesComponent,
  },
  {
    path: 'drivers',
    canActivate: [canActivate],
    component: DriversComponent,
  },
  {
    path: 'load',
    canActivate: [canActivate],
    redirectTo: '/loads'
  },
  {
    path: 'loads',
    canActivate: [canActivate],
    component: LoadsComponent,
  },
  {
    path: 'loads-available',
    canActivate: [canActivate],
    component: LoadsAvailableComponent,
  },
  {
    path: 'bids',
    canActivate: [canActivate],
    component: BidsComponent,
  },
  {
    path: 'adverts',
    canActivate: [canActivate],
    component: AdvertsComponent,
  },
  {
    path: 'directories',
    canActivate: [canActivate],
    component: DirectoriesComponent,
  },
  {
    path: 'business-directory',
    canActivate: [canActivate],
    component: BusinessDirectoryComponent,
  },

  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
