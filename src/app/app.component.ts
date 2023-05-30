import { Component } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { LinkMenuItem } from 'ngx-auth-firebaseui';
import { Observable } from 'rxjs';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EventEmitterService } from './services/event-emitter.service';
import { PageLayout } from './interfaces/pageLayout';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'loadgistix';
  loading$: Observable<boolean>;
  loading = false;
  lat = 22.2736308;
  long = 70.7512555;
  user!: firebase.default.User | null;
  links!: LinkMenuItem[];
  menuInnerItems: any[] = GlobalConstants.pages.filter((x: { location: string; }) => x.location === 'bottom');
  menuTopLeftItems: any[] = GlobalConstants.pages.filter((x: { location: string; }) => x.location === 'top-left');
  menuTopRightItems: any[] = GlobalConstants.pages.filter((x: { location: string; }) => x.location === 'top-right');
  pageSelected: string | null = GlobalConstants.pageSelected;
  menuSelected: string | null = GlobalConstants.menuSelected;

  constructor(
    private loadingScreenService: LoadingScreenService,
    private router: Router,
    private fireAuth: AngularFireAuth,
    private dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {
    this.loading$ = this.loadingScreenService.loading$;
    this.getSelected();
    eventEmitterService.invokeChangePageFunction.subscribe(() => {
      this.getSelected();
    });
  }

  ngOnInit() {
    this.loadingScreenService.startLoading();
    // Simulate a long-running task
    setTimeout(() => {
      this.loadingScreenService.stopLoading();
    }, 5000);
  }

  async getSelected() {
    let pageSelected = (await Preferences.get({ key: 'pageSelected' })).value;
    this.pageSelected = pageSelected ? pageSelected : 'Dashboard';

    let menuSelected = (await Preferences.get({ key: 'menuSelected' })).value;
    this.menuSelected = menuSelected ? menuSelected : null;

    if (this.menuSelected == null) {
      let menuSelectedNew = GlobalConstants.pages.find((x: { value: string | null; }) => x.value === this.pageSelected);
      if (menuSelectedNew?.children.length! > 0) {
        this.menuSelected = menuSelectedNew?.children[0]!.value!;
        Preferences.set({ key: 'menuSelected', value: menuSelectedNew?.children[0]!.value! });
      }
    }
  }

  selectPage(pageSelected: string) {
    Preferences.set({ key: 'pageSelected', value: pageSelected });
    this.pageSelected = pageSelected;
    this.router.navigate(['/' + pageSelected]);
    this.selectMenu('');
  }

  selectMenu(menuSelected: string) {
    if (menuSelected !== '') {
      Preferences.set({ key: 'menuSelected', value: menuSelected });
      this.menuSelected = menuSelected;
      this.router.navigate(['/' + menuSelected]);
    } else {
      let menuSelectedNew = GlobalConstants.pages.find((x: { value: string | null; }) => x.value === this.pageSelected);
      if (menuSelectedNew?.children.length! > 0) {
        Preferences.set({ key: 'menuSelected', value: menuSelectedNew?.children[0]!.value! });
        this.menuSelected = menuSelectedNew?.children[0]!.value!;
        this.router.navigate(['/' + this.menuSelected]);
      }
    }
  }

  getMenuLabel(): string {
    return GlobalConstants.pages.find((x: { value: string | null; }) => x.value === this.pageSelected)?.label ?? '';
  }

  getSubMenu(): PageLayout[] | [] {
    return GlobalConstants.pages.find((x: { value: string | null; }) => x.value === this.pageSelected)?.children ?? [];
  }


  initAuth() {
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.data = {
    //   title: 'Authenticate',
    //   message: 'Sign in / Sign up',
    //   roundCropper: false
    // };

    // dialogConfig.autoFocus = true;
    // dialogConfig.disableClose = true;
    // dialogConfig.hasBackdrop = true;
    // dialogConfig.ariaLabel = 'fffff';
    // dialogConfig.width = "90vw";
    // dialogConfig.maxWidth = "800px";
    // dialogConfig.panelClass = 'my-dialog';

    // const dialogRef = this.dialog.open(DialogAuthenticateComponent,
    //   dialogConfig);
  }

  signOut() {
    this.fireAuth.signOut();
    this.router.navigate(['/home']);
  }

  initializeAuth() {

  }
}
