import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-directories',
  templateUrl: './directories.component.html',
  styleUrls: ['./directories.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DirectoriesComponent implements OnInit, OnDestroy {
  subscriptionDirectories!: Subscription;

  constructor(
    private eventEmitterService: EventEmitterService
  ) {
    this.eventEmitterService.onChangePage('Adverts');
    // this.dataSource = new MatTableDataSource;
  }

  ngOnInit(): void {
    this.eventEmitterService.onChangePage('My Adverts');
  }

  // getDrivers() {
  //   this.subscriptionDrivers = this.driverService.getDrivers().subscribe(driverList => {
  //       console.log('driverList', driverList);
  //       this.driverList = driverList;
  //       this.dataSource.data = this.driverList;
  //       this.dataSource.paginator = this.paginatorDriver;
  //       this.dataSource.sort = this.sortDriver;
  //   });



  ngOnDestroy() {
    // this.subscriptionLicenseTypes.unsubscribe();
    // this.subscriptionDrivers.unsubscribe();
  }
}
