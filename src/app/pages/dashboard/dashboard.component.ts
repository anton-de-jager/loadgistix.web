import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  subscriptionDashboard!: Subscription;


  ngOnDestroy() {
    // this.subscriptionLicenseTypes.unsubscribe();
    // this.subscriptionDrivers.unsubscribe();
  }
}
