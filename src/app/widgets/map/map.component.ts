import { Component, OnInit, AfterViewInit, Inject, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { load } from 'src/app/models/load.model';
import { directory } from 'src/app/models/directory.model';
import { Capacitor } from '@capacitor/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VariableService } from 'src/app/services/variable.service';
import { Position } from '@capacitor/geolocation';

const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0
};

import { AgmCoreModule } from '@agm/core';

const iconRetinaUrl = 'assets/images/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/images/leaflet/location_green.png';
const shadowUrl = 'assets/images/leaflet/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/location_green.png',
    shadowUrl,
    iconSize: [33, 43],
    iconAnchor: [16, 43],
    shadowAnchor: [12, 53],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [43, 53]
});
const iconFrom = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/truck_green.png',
    shadowUrl,
    iconSize: [33, 33],
    iconAnchor: [16, 33],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [33, 33]
});
const iconTo = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/location_red.png',
    shadowUrl,
    iconSize: [23, 32],
    iconAnchor: [12, 32],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [32, 32]
});

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit, OnChanges {
    private map!: L.Map;
    @Input() loadsAvailable: load[] = [];
    @Input() directoryList: directory[] = [];

    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    loaded = false;
    iLoaded = 0;
    lat: number = -26.330647;
    lon: number = 28.107455;
    mapReady: boolean = false;
    signal = true;

    message = '';

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private variableService: VariableService
    ) {
    }

    ngOnChanges() {
        this.iLoaded = 0;
        this.getCurrentLocation();
    }

    waitingForCurrentPosition = false;
    currentPos!: Position;
    async getCurrentPos() {
        try {
            this.variableService.checkLocationPermissions(false).then(async permission => {
                this.signal = permission;
                if (permission) {
                    this.waitingForCurrentPosition = true;
                    this.variableService.getPosition().then(position => {
                        this.currentPos = position!;
                        console.log(this.currentPos);
                    });
                } else {
                    //this.variableService.showInfo('ERROR', 'Permission Error', 'Location needs to be enabled for this feature', false).then(showInfoResult => { });
                }
            });
        } catch (err) {
            console.error('Failed to get current position.', err);
        } finally {
            this.waitingForCurrentPosition = false;
        }
    }

    async getCurrentLocation() {
        this.variableService.checkLocationPermissions(false).then(async permission => {
            this.signal = permission;
            if (permission) {
                this.variableService.getPosition().then(coordinates => {
                    this.message += '<ul><li>lat: ' + coordinates!.coords.latitude + '</li><li>lon: ' + coordinates!.coords.longitude + '</li></ul>'
                    this.lat = coordinates!.coords.latitude;
                    this.lon = coordinates!.coords.longitude;
                    this.loaded = true;
                    this.initMap();
                });
            } else {
                //this.variableService.showInfo('ERROR', 'Permission Error', 'Location needs to be enabled for this feature', true).then(showInfoResult => {
                    this.loaded = true;
                    this.initMap();
                //});
            }
        });

    }

    requestPermission() {
        if (Capacitor.getPlatform() !== 'web') {
            this.variableService.requestPermission().then(location => {
                if (location == 'granted') {
                    this.signal = true;
                }
            });
        }
    }

    private initMap(): void {
        if (this.loaded && this.mapReady && this.iLoaded < 100) {
            if (this.map) {
                this.map.off();
                this.map.remove();
            }

            this.map = L.map('map', {
                center: [this.lat, this.lon],
                zoom: 14
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 3,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            const planOptions: L.Routing.PlanOptions = {
                addWaypoints: false,
                draggableWaypoints: false,
                createMarker: function () { return false; },
                createGeocoderElement: function () { return null!; },
                createGeocoder: function () { return null!; }
            };

            var minlat = 200, minlon = 200, maxlat = -200, maxlon = -200;
            this.loadsAvailable.forEach(loadItem => {
                let plan = new L.Routing.Plan([new L.LatLng(loadItem!.originatingAddressLat!, loadItem.originatingAddressLon!), new L.LatLng(loadItem.destinationAddressLat!, loadItem.destinationAddressLon!)], planOptions);

                let control = L.Routing.control({
                    router: L.Routing.osrmv1({
                        serviceUrl: `https://router.project-osrm.org/route/v1/`,
                        useHints: false
                    }),
                    collapsible: false,
                    showAlternatives: false,
                    fitSelectedRoutes: false,
                    show: false,
                    routeWhileDragging: false,
                    plan
                });
                control.addTo(this.map)!.getContainer()!.style.display = "None";

                if (minlat > loadItem.originatingAddressLat!) minlat = loadItem!.originatingAddressLat!;
                if (minlon > loadItem.originatingAddressLon!) minlon = loadItem.originatingAddressLon!;
                if (maxlat < loadItem.originatingAddressLat!) maxlat = loadItem.originatingAddressLat!;
                if (maxlon < loadItem.originatingAddressLon!) maxlon = loadItem.originatingAddressLon!;

                if (minlat > loadItem.destinationAddressLat!) minlat = loadItem.destinationAddressLat!;
                if (minlon > loadItem.destinationAddressLon!) minlon = loadItem.destinationAddressLon!;
                if (maxlat < loadItem.destinationAddressLat!) maxlat = loadItem.destinationAddressLat!;
                if (maxlon < loadItem.destinationAddressLon!) maxlon = loadItem.destinationAddressLon!;

                L.marker(new L.LatLng(loadItem.originatingAddressLat!, loadItem.originatingAddressLon!), { icon: iconFrom }).addTo(this.map).on('click', () => {
                    this.select.emit(loadItem);
                });
                L.marker(new L.LatLng(loadItem.destinationAddressLat!, loadItem.destinationAddressLon!), { icon: iconTo }).addTo(this.map).on('click', () => {
                    this.select.emit(loadItem);
                });
            });

            this.directoryList.forEach(loadItem => {
                if (minlat > loadItem.addressLat!) minlat = loadItem.addressLat!;
                if (minlon > loadItem.addressLon!) minlon = loadItem.addressLon!;
                if (maxlat < loadItem.addressLat!) maxlat = loadItem.addressLat!;
                if (maxlon < loadItem.addressLon!) maxlon = loadItem.addressLon!;

                L.marker(new L.LatLng(loadItem.addressLat!, loadItem.addressLon!), { icon: iconDefault }).addTo(this.map).on('click', () => {
                    this.select.emit(loadItem);
                });
            });

            setTimeout(() => {
                this.map.fitBounds(L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)))
            }, 100);
        } else {
            setTimeout(() => {
                this.iLoaded++;
                this.initMap();
            }, 500);
        }
    }


    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.mapReady = true;
    }
}