import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotFoundComponent implements OnInit {

  constructor(
    private eventEmitterService: EventEmitterService
) {
}

  ngOnInit(): void {
    this.eventEmitterService.onChangePage('Page not found');
  }

}
