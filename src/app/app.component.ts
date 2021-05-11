import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './shared/services/auth.service';
import { RoutingStateService } from './shared/services/routing-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService, private authService: AuthService, routingState: RoutingStateService) {
    translate.setDefaultLang('en');
    // routingState.loadRouting();
  }

  ngOnInit() {
    //   this.authService.initAuthListener();
  }
}
