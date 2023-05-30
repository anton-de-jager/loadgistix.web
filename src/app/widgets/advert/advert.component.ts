import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VariableService } from 'src/app/services/variable.service';
import { interval, Subscription } from 'rxjs';
import { advert } from 'src/app/models/advert.model';
import { ApiService } from 'src/app/services/api.service';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
    selector: 'advert',
    templateUrl: './advert.component.html',
    styleUrls: ['./advert.component.scss'],
    // encapsulation: ViewEncapsulation.None
})
export class AdvertComponent implements OnInit {
    @Input() side: boolean = false;
    advertItems: advert[] = [];
    timestamp: number = 0;
    loading: boolean = true;
    subscription!: Subscription;

    constructor(
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        public eventEmitterService: EventEmitterService,
        private _router: Router) {
        this.timestamp = new Date().getTime();
    }

    ngOnInit() {
        this.getAdverts().then(getAdvertsResult => {
            this.advertItems = getAdvertsResult;
            this.advertItems.push({title: 'Title', subTitle: 'Subtitle', content: 'This is what  want to say'});
            this.advertItems.push({title: 'Title', subTitle: 'Subtitle', content: 'This is what  want to say'});
            this.advertItems.push({title: 'Title', subTitle: 'Subtitle', content: 'This is what  want to say'});
            this.advertItems.push({title: 'Title', subTitle: 'Subtitle', content: 'This is what  want to say'});
            this.advertItems.push({title: 'Title', subTitle: 'Subtitle', content: 'This is what  want to say'});
        })
        const source = interval(600000);
        this.subscription = source.subscribe(val => {
            this.getAdverts().then(getAdvertsResult => {
                this.advertItems = getAdvertsResult;
                this.timestamp = new Date().getTime();
            });
        });
    }

    getAdverts(): Promise<advert[]> {
        var promise = new Promise<advert[]>((resolve) => {
            try {
                this.apiService.getItems('adverts').subscribe((apiResult: any) => {
                    resolve(apiResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    navigateExternal(event: Event, url: string) {
        event.preventDefault();
        if (Capacitor.isNativePlatform()) {
            Browser.open({ url });
        } else {
            window.open(url, '_blank');
        }
    }
}
