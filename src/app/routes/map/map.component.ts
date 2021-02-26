import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfigService} from "../../shared/services/config.service";
import {HttpClient} from "@angular/common/http";
import {
    Feature,
    FeatureClass,
    FeatureLayer, Field, FieldType,
    GeometryType,
    Layer,
    Point, SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol, SimplePointSymbol,
    SimpleRenderer
} from 'green-gis';
import {LayerService} from '../../shared/services/layer.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

    map: any;
    amap: any;
    mode: number = 0;

    _subscriptions: any = [];

    constructor(private changeDetector: ChangeDetectorRef, private configService: ConfigService, private http: HttpClient, private layerService: LayerService) {
    }

    ngOnInit() {

    }

    ngOnDestroy(): void {
        this._subscriptions.forEach( sub => {
            sub.unsubscribe();
        });
    }


    /////////////////以下私有函数/////////////////////
    _load(data): FeatureLayer {
        const featureClass = new FeatureClass(GeometryType.Point);
        featureClass.loadGeoJSON(data);
        const featureLayer = new FeatureLayer();
        featureLayer.featureClass = featureClass;

        //extract fields
        if (featureClass.features.length > 0) {
            const feature = featureClass.features[0];
            Object.keys(feature.properties).forEach(key => {
                const field = new Field();
                field.name = key;
                field.alias = key;
                field.type = typeof feature.properties[key] === "number" ? FieldType.Number : FieldType.String;
                featureClass.addField(field);
            });
        }

        const renderer = new SimpleRenderer();
        switch (featureClass.type) {
            case GeometryType.Polyline:
                renderer.symbol = new SimpleLineSymbol();
                break;
            case GeometryType.Polygon:
                renderer.symbol = new SimpleFillSymbol();
                break;
            case GeometryType.Point:
                renderer.symbol = new SimplePointSymbol();
                break;
        }
        featureLayer.renderer = renderer;
        return featureLayer;
    }

    /////////////////以下界面交互/////////////////////
    mapInit(event) {
        this.map = event.map;
        this.amap = event.amap;
        this.map.setView([this.configService.config.map.center.lng, this.configService.config.map.center.lat], this.configService.config.map.zoom);
        this.layerService.on("open", (layer) => {
            this.mode = 1;
            setTimeout((event) => {
                this.map.resize();
            })
        });
        this.layerService.on("close", () => {
            this.mode = 0;
            setTimeout((event) => {
                this.map.resize();
            })
        });
        this.changeDetector.detectChanges();
        this.http.get("assets/json/sensor.json").subscribe(data => {
            const featureLayer = this._load(data);
            featureLayer.name = "sensor";
            this.layerService.add(featureLayer);
        });
        this.http.get("assets/json/beijing.json").subscribe(data => {
            const featureLayer = this._load(data);
            featureLayer.name = "beijing";
            this.layerService.add(featureLayer);
        });
        this.http.get("assets/json/chongqing.json").subscribe(data => {
            const featureLayer = this._load(data);
            featureLayer.name = "chongqing";
            this.layerService.add(featureLayer);
        });
    }

    open(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = JSON.parse(e.target.result);
            const featureLayer = this._load(data);
            const index = file.name.lastIndexOf(".");
            featureLayer.name = file.name.substring(0, index);
            this.layerService.add(featureLayer);
        };
        reader.readAsText(file);
    }

}
