import { Injectable, EventEmitter } from '@angular/core';
import{ GlobalConstants } from '../shared/global-constants';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService {

    invokeChangeMenuFunction = new EventEmitter()
    invokeChangePageFunction = new EventEmitter();
    invokeChangePageSizeFunction = new EventEmitter();
    invokeGlobalEvent = new EventEmitter();

    constructor() { }

    onChangePage(page: string) {
        switch (page) {
            case 'home':
                this.invokeChangePageFunction.emit(
                    {
                        pageDescription: 'Home',
                        topButtons: [],
                        bottomButtons: []
                    }
                );
                break;
            default:
                this.invokeChangePageFunction.emit(
                    {
                        pageDescription: page,
                        topButtons: [],
                        bottomButtons: []
                    }
                );
                break;
        }

    }

    onChangeMenu(menu: string) {
        switch (menu) {
            case 'lookups':
                this.invokeChangePageFunction.emit(
                    {
                        pageDescription: 'Lookups',
                        topButtons: [],
                        bottomButtons: []
                    }
                );
                break;
            default:
                this.invokeChangePageFunction.emit(
                    {
                        pageDescription: menu,
                        topButtons: [],
                        bottomButtons: []
                    }
                );
                break;
        }

    }

    onChangePageSize(mode: string){
        GlobalConstants.pageMode = mode;
    }

    onGlobalEvent(key: string, value: any) {
        this.invokeGlobalEvent.emit({ key: key, value: value });
    }
}    