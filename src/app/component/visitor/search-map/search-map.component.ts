import { Component, OnInit, ViewChild, ElementRef, Input, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

import { ItineraryService } from '../../../service/itinerary.service';
import { Itinerary } from '../../../model/itinerary';
import { IInfoWindowComponent } from '../../../component/visitor/i-info-window/i-info-window.component';

import 'js-marker-clusterer/src/markerclusterer.js';

declare var google: any;
declare var MarkerClusterer;

@Component({
    selector: 'app-search-map',
    templateUrl: './search-map.component.html',
    styleUrls: ['./search-map.component.scss']
})
export class SearchMapComponent implements OnInit {
    @Input() itineraries: Array<Itinerary> = [];

    map: any = null;
    infoWindows: Array<any> = [];

    waterColor = '#1F5180'; // Second Color;
    landColor = '#DADADA'; // Font Color;
    parkColor = '#A4B494';

    @ViewChild('container') container: ElementRef;

    constructor(private mapsAPILoader: MapsAPILoader, private itineraryService: ItineraryService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
    }

    ngOnInit() {
    }

    replaceAll(str: string, replace: string, value: string): string {
        return str.replace(new RegExp(replace, 'g'), value);
    }

    loadMap() {
        const that = this;

        this.mapsAPILoader.load().then(() => {
            const element = document.getElementById('searchmap');
            this.container.nativeElement.style.height = '500px';
            element.style.height = '100%';

            that.map = new google.maps.Map(element, {
                zoom: 2,
                center: { lat: 18.5284128, lng: 13.9502671 },
                styles: [
                    { 'featureType': 'road', 'stylers': [{ 'visibility': 'off' }] },
                    { 'featureType': 'water', 'stylers': [{ 'color': that.waterColor }] },
                    { 'featureType': 'transit', 'stylers': [{ 'visibility': 'off' }] },
                    { 'featureType': 'landscape.natural', 'stylers': [{ 'visibility': 'on' }, { 'color': that.landColor }] },
                    { 'featureType': 'administrative.province', 'stylers': [{ 'visibility': 'off' }] },
                    { 'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [{ 'color': that.parkColor }] },
                    { 'featureType': 'administrative.country', 'elementType': 'geometry.stroke', 'stylers': [{ 'visibility': 'on' }, { 'color': '#7f7d7a' }, { 'lightness': 10 }, { 'weight': 1 }] }
                ]
            });

            const locations = [];

            that.itineraries.forEach(function (element) {
                const l = { lat: element.stepLat, lng: element.stepLng };
                const m = new google.maps.Marker({
                    position: l,
                    icon: '/assets/images/icon0.svg'
                });
                locations.push(m);

                that.createInfoWindowForStep(element, m, l);
            });

            setTimeout(function () {
                const markerCluster = new MarkerClusterer(that.map, locations, { imagePath: '/assets/images/markers/m' });
            }, 500);
        });
    }

    unloadMap() {
        const element = document.getElementById('searchmap');
        this.container.nativeElement.style.height = '0';

        element.innerHTML = '';
        element.style.height = '0';
    }

    private createInfoWindowForStep(itinerary: Itinerary, marker: any, location: any) {
        let content = itinerary.description;
        const username = itinerary.users[0].name;
        const itineraryid = itinerary.id;

        content += '<br/><p><a href="/visiteur/' + this.sanitize(username) + '/' + itineraryid + '/' + this.sanitize(itinerary.name) + '" target="_blank" rel="noopener">Voir l\'itinéraire de ' + username + '</a></p>';

        const that = this;

        this.attachClickEvent(marker, location, itinerary.name, itinerary.country, content);
    }

    private attachClickEvent(marker: any, location: any, title: string, country: string, description: string) {
        const that = this;

        google.maps.event.addListener(marker, 'click', function (e) {
            const infoWindow = that.createComponent();

            infoWindow.instance.create(location.lat, location.lng, title, country, description, null, null);
            that.infoWindows.push(infoWindow.instance);

            that.infoWindows.forEach(element => { element.close(); });

            infoWindow.instance.open(that.map, marker);
            infoWindow.changeDetectorRef.detectChanges();

            const element = document.getElementsByClassName('gm-style-iw');

            setTimeout(function () {
                const preElement: any = document.getElementsByClassName('gm-style-iw')[0].previousElementSibling;
                const nextElement: any = document.getElementsByClassName('gm-style-iw')[0].nextElementSibling;

                preElement.children[1].style.display = 'none';
                preElement.children[3].style.display = 'none';
                nextElement.className = 'iw-close';
            }, 200);
        });
    }

    private createComponent(): ComponentRef<IInfoWindowComponent> {
        const factory = this.componentFactoryResolver.resolveComponentFactory(IInfoWindowComponent);
        const ref = this.viewContainerRef.createComponent(factory);
        ref.changeDetectorRef.detectChanges();

        return ref;
    }

    private sanitize(str: string): string {
        if (!str || str.length === 0) {
            return str;
        }

        let tmp = this.replaceAll(str.toLocaleLowerCase().trim(), ' ', '-');
        tmp = this.replaceAll(tmp, '[^a-z0-9éèàôûîïêù]', '-');
        tmp = this.replaceAll(tmp, '[--]+', '-');

        return encodeURIComponent(tmp);
    }
}
