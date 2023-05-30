import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrls: ['./map-google.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapGoogleComponent implements OnInit {

  constructor(
    private eventEmitterService: EventEmitterService
) {
}

  ngOnInit(): void {
    this.eventEmitterService.onChangePage('Loads Available');
  }

}
