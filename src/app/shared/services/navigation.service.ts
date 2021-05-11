import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class NavigationService {
  titleChange = new Subject<string>();
  // title: string;

  backButtonChange = new Subject<boolean>();
  // back: true;

  constructor() {}

  setTitle(title: string) {
    this.titleChange.next(title);
  }

  getTitle(): Observable<string> {
    return this.titleChange.asObservable();
  }

  setBack(back: boolean) {
    this.backButtonChange.next(back);
  }

  isBack(): Observable<boolean> {
    return this.backButtonChange.asObservable();
  }
}
