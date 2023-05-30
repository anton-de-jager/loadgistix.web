import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingScreenService {
  private _loading$ = new BehaviorSubject(false);
  loading$ = this._loading$.asObservable();

  startLoading() {
    this._loading$.next(true);
  }

  stopLoading() {
    this._loading$.next(false);
  }
}
