import { Component, OnInit } from '@angular/core';
import { RoutingStateService } from '../shared/services/routing-state.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    constructor(private routingState: RoutingStateService) {
        routingState.loadRouting();
    }

    ngOnInit() {}
}
