import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class RoutingStateService {
  private history = [];

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {}

  public loadRouting(): void {
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(({urlAfterRedirects}: NavigationEnd) => {
    //     this.history = [...this.history, urlAfterRedirects];
    //   });
    this.currentUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        localStorage.setItem('previousUrl', this.currentUrl);
        localStorage.setItem('currentUrl', event.url);
      }
    });
  }
  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    // return this.history[this.history.length - 2] || '/index';
    return this.previousUrl;
  }


  public getCurrentUrl(): string {
    // return this.history[this.history.length - 2] || '/index';
    return this.currentUrl;
  }
}
