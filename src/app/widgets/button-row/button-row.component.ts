import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'button-row',
  templateUrl: './button-row.component.html',
  styleUrls: ['./button-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonRowComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() placement: string = 'bottom'
  @Input() value: string | null = null;

  constructor(
    private router: Router,
    public eventEmitterService: EventEmitterService) {
  }

  ngOnInit(): void {
  }

  selectionChanged(val: string, label: string) {
    GlobalConstants.pageSelected = label;
    this.eventEmitterService.onChangePage(label);
    this.router.navigate(['/' + val]);
  }
}
