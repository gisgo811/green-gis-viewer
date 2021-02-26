import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "../../services/config.service";
import {LayerService} from '../../services/layer.service';

@Component({
    selector: 'green-map-table',
    templateUrl: './green-map-table.component.html',
    styleUrls: ['./green-map-table.component.scss']
})
export class GreenMapTableComponent implements OnInit, OnDestroy {

    @Input() visible: boolean;

    constructor(public layerService: LayerService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

    /////////////////以下私有函数/////////////////////

    /////////////////以下界面交互/////////////////////
    close() {
        this.layerService.close();
    }
}
