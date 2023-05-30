import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private eventEmitterService: EventEmitterService
) {
}

  ngOnInit(): void {
    this.eventEmitterService.onChangePage('Privacy Policy');
  }

}
