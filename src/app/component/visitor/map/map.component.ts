import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

import { ItineraryStep } from '../../../model/itinerary-step';
import { Picture } from '../../../model/picture';
import { Stop } from '../../../model/stop';
import { ItineraryService } from '../../../service/itinerary.service';
import { IInfoWindowComponent } from '../i-info-window/i-info-window.component';
import { environment } from '../../../../environments/environment';
import { ItineraryDetailService } from '../../../service/itineraryDetail.service';
import { StepDetail } from '../../../model/step-detail';

declare var google: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [ItineraryDetailService]
})
export class MapComponent implements OnInit {
    multiple = false;
    serviceUrl: string;

    map: any = null;
    infoWindows: Array<any> = [];
    markers: Array<any> = [];

    flightLineColor = '#8C3432'; // darken(cutColor, 10%);
    roadLineColor = '#FF5E5B'; // Cut Color;
    waterColor = '#1F5180'; // Second Color;
    landColor = '#DADADA'; // Font Color;
    parkColor = '#A4B494';

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private itineraryDetailService: ItineraryDetailService,
        private itineraryService: ItineraryService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {
    }

    ngOnInit() {
        this.serviceUrl = environment.apiUrl;
    }

    updateDirections(origin, destination, waypoints, markerIndex = 0) {
        const that = this;

        if (origin.object.id != null && origin.object.id > 0) {
            this.mapsAPILoader.load().then(() => {
                // Init GMaps direction services
                const directionsService = new google.maps.DirectionsService;
                const directionsDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: this.roadLineColor
                    }
                });

                // If no maps yet, we create it
                if (!that.map || that.map == null || that.map == {}) {
                    that.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 3,
                        center: { lat: origin.latitude, lng: origin.longitude },
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
                }

                // Assign direction service to the created map
                directionsDisplay.setMap(that.map);
                directionsDisplay.setOptions({
                    suppressMarkers: true,
                });

                // Create a marker at the first step of the itinerary
                const photos = this.itineraryService.getStepPictures(origin.object.id).subscribe(
                    result => that.createInfoWindowForStep(result, origin.object, markerIndex),
                    error => alert(error)
                );
                // Create a marker at the last step of the itinerary if exists
                if (destination.object.id != null && destination.object.id > 0) {
                    this.itineraryService.getStepPictures(destination.object.id).subscribe(
                        result => that.createInfoWindowForStep(result, destination.object, markerIndex),
                        error => alert(error)
                    );
                }

                // If too much steps, batch by group of ten
                const batches = this.getBatches(waypoints);
                // to hold the counter and the results themselves as they come back, to, later, sort them
                const unsortedResults = [{}];
                const directionsResultsReturned = { number: 0 };

                // Trace route for each batch of steps
                for (let k = 0; k < batches.length; k++) {
                    const mode = batches[k][0].mode;

                    const lastIndex = batches[k].length - 1;
                    const start = batches[k][0].location;
                    const end = batches[k][lastIndex].location;

                    // trim first and last entry from array
                    let waypts = [];
                    waypts = batches[k];
                    waypts.splice(0, 1);
                    waypts.splice(waypts.length - 1, 1);

                    // create the request in google maps format
                    const request = {
                        origin: start,
                        destination: end,
                        waypoints: waypts,
                        travelMode: end.type
                    };

                    // Execute the calculation with a counter to sort later
                    (function (kk, mode) {
                        that.calculateAndDisplayRoute(directionsService, directionsDisplay, request, waypoints, mode, batches.length, kk, unsortedResults, directionsResultsReturned, markerIndex);
                    })(k, mode);
                }
            });
        }
    }

    drawItineraries(steps: Array<Array<ItineraryStep>>) {
        const that = this;
        this.multiple = true;

        steps.forEach(function (element: Array<ItineraryStep>) {
            if (element.length > 0) {
                let origin = {};
                let destination = {};

                origin = {
                    latitude: element[0].lat,
                    longitude: element[0].lng,
                    object: element[0]
                };

                if (element.length > 1) {
                    destination = {
                        latitude: element[element.length - 1].lat,
                        longitude: element[element.length - 1].lng,
                        object: element[element.length - 1]
                    };
                }
                const waypoints = element;

                setTimeout(function () {
                    const iconMarkerIndex = Math.floor(Math.random() * 5);
                    that.updateDirections(origin, destination, waypoints, iconMarkerIndex);
                }, 500);
            }
        });
    }

    private getBatches(stops: Array<ItineraryStep>): Array<any> {
        const batches = [];
        const itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
        let itemsCounter = 0;
        let wayptsExist = stops.length > 0;

        while (wayptsExist) {
            const subBatch = [];
            const flightBatch = [];
            let subitemsCounter = 0;

            for (let j = itemsCounter; j < stops.length; j++) {
                if (stops[j].type === 'FLIGHT') {
                    flightBatch.push({
                        location: stops[j - 1],
                        stopover: true,
                        mode: 'flight'
                    });
                    flightBatch.push({
                        location: stops[j],
                        stopover: true,
                        mode: 'flight'
                    });
                }

                subitemsCounter++;

                if (stops[j].type !== 'FLIGHT') {
                    if (j > 0 && stops[j - 1].type === 'FLIGHT') {
                        subBatch.push({
                            location: stops[j - 1],
                            stopover: true,
                            mode: 'normal'
                        });
                    }
                    subBatch.push({
                        location: stops[j],
                        stopover: true,
                        mode: 'normal'
                    });
                }
                if (subitemsCounter === itemsPerBatch || flightBatch.length > 0) {
                    break;
                }
            }

            itemsCounter += subitemsCounter;

            if (subBatch.length > 0) {
                batches.push(subBatch);
            }

            wayptsExist = itemsCounter < stops.length;
            if (flightBatch.length > 0) {
                batches.push(flightBatch);
            } else {
                // If it runs again there are still points. Minus 1 before continuing to
                // start up with end of previous tour leg
                itemsCounter--;
            }
        }

        return batches;
    }

    private calculateAndDisplayRoute(directionsService, directionsDisplay, request, allWaypoints, mode, batchesLength, counter, unsortedResults, directionsResultsReturned, markerIndex) {
        const that = this;
        const waypts = request.waypoints;

        if (mode === 'flight') {
            const line = new google.maps.Polyline({
                strokeColor: this.flightLineColor,
                strokeOpacity: 0,
                icons: [{
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 4
                    },
                    offset: '0',
                    repeat: '20px'
                }],
                strokeWeight: 3,
                geodesic: true,
                map: that.map
            });

            const path = [request.origin, request.destination];
            line.setPath(path);

            that.itineraryService.getStepPictures(request.origin.id).subscribe(
                result => that.createInfoWindowForStep(result, request.origin, markerIndex),
                error => alert(error)
            );
            that.itineraryService.getStepPictures(request.destination.id).subscribe(
                result => that.createInfoWindowForStep(result, request.destination, markerIndex),
                error => alert(error)
            );
            directionsResultsReturned.number++;
        } else {
            request.waypoints.forEach(function (element) {
                delete element.mode;
            });

            that.traceRoute(that, request, directionsService, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, batchesLength, markerIndex, 0);
        }
    }

    private traceRoute(that, request, directionsService, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, batchesLength, markerIndex, retryNumber) {
        directionsService.route(request, function (response, status) {
            if (status === 'OK') {
                retryNumber = 0;
                that.manageOkResult(that, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, response, batchesLength, markerIndex);
            } else {
                if (retryNumber < 4) {
                    setTimeout(function () {
                        retryNumber++;
                        console.log('retry: ' + retryNumber + ' ' + new Date().getTime());
                        that.traceRoute(that, request, directionsService, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, batchesLength, markerIndex, retryNumber);
                    }, 2001);
                } else {
                    console.log(status);
                    console.log(request);
                    window.alert('Aucune route n\'a été trouvé pour rejoindre certains points de l\'itinéraire. Il faut surement changer le moyen de transport de certaines étapes :)');
                }
            }
        });
    }

    private manageOkResult(that, directionsDisplay, allWaypoints, unsortedResults, directionsResultsReturned, counter, response, batchesLength, markerIndex) {
        // Push the result with the order number
        unsortedResults.push({ order: counter, result: response });
        directionsResultsReturned.number++;

        // If it's the last result, trace routes
        if (directionsResultsReturned.number == batchesLength) {
            // sort the array
            unsortedResults.sort(function (a, b) { return parseFloat(a.order) - parseFloat(b.order); });

            // browse it to trace routes
            let count = 0;
            let combinedResult;

            for (const key in unsortedResults) {
                if (unsortedResults[key].result !== null) {
                    if (unsortedResults.hasOwnProperty(key)) {
                        combinedResult = that.getGoogleMapsRoute(combinedResult, key, unsortedResults, count);
                        count++;
                    }
                }
            }

            directionsDisplay.setDirections(combinedResult);
            const legs = combinedResult.routes[0].legs;

            const tmpWaypoints = allWaypoints.filter(w => w.type !== 'FLIGHT');

            legs.forEach(function (element, index) {
                if (tmpWaypoints[index] != null) {
                    that.itineraryService.getStepPictures(tmpWaypoints[index].id).subscribe(
                        result => that.createInfoWindowForStep(result, tmpWaypoints[index], markerIndex),
                        error => alert(error)
                    );
                }
            });

            if (that.multiple) {
                setTimeout(function () {
                    that.map.setZoom(3);
                    that.map.setCenter({ lat: 22.6102934, lng: 7.5675984 });
                }, 500);
            }
        }
    }

    private getGoogleMapsRoute(combinedResults, key, unsortedResults, count) {
        if (count === 0) {// first results. new up the combinedResults object
            if (unsortedResults[key].result) {
                combinedResults = unsortedResults[key].result;
            } else {
                combinedResults = unsortedResults[1 + (key * 1)].result;
            }
        } else {
            // only building up legs, overview_path, and bounds in my consolidated object. This is not a complete
            // directionResults object, but enough to draw a path on the map, which is all I need
            combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(unsortedResults[key].result.routes[0].legs);
            combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(unsortedResults[key].result.routes[0].overview_path);

            combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getNorthEast());
            combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getSouthWest());
        }
        return combinedResults;
    }

    createInfoWindowForStop(pictures: Array<Picture>, origin: Stop) {
        this.createInfoWindow(pictures, origin.city, origin.description, [], origin.date, origin.lat, origin.lng, null);
    }

    createInfoWindowForStep(pictures: Array<Picture>, origin: ItineraryStep, markerIndex) {
        this.itineraryDetailService.getStepDetails(origin.id.toString()).subscribe(
            data => {
                this.createInfoWindow(pictures, origin.city, origin.description, data, origin.date, origin.lat, origin.lng, markerIndex);
            },
            error => alert(error)
        );
    }

    private createInfoWindow(pictures: Array<Picture>, city, description, details, date, lat, lng, markerIndex) {
        this.mapsAPILoader.load().then(() => {
            const marker = this.createMarker({ lat: lat, lng: lng }, this.map, city, markerIndex == null ? true : false, markerIndex);

            this.attachClickEvent(marker, { lat: lat, lng: lng }, city, date, description, details, pictures);
        });
    }

    private createMarker(location: any, map: any, title: string, isStop: boolean = false, markerIndex) {
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: isStop ? '/assets/images/icon-stop.svg' : '/assets/images/icon' + markerIndex + '.svg',
            clickable: true,
            title: title,
        });
        this.markers.push(marker);

        return marker;
    }
    private attachClickEvent(marker: any, location: any, city, date, description, details, pictures) {
        const that = this;

        google.maps.event.addListener(marker, 'click', function (e) {
            const infoWindow = that.createComponent();

            infoWindow.instance.create(location.lat, location.lng, city, 'Le ' + date, description, details, pictures);
            that.infoWindows.push(infoWindow.instance);

            that.infoWindows.forEach(element => { element.close(); });

            infoWindow.instance.open(that.map, marker);
            infoWindow.changeDetectorRef.detectChanges();

            setTimeout(function(){
                const preElement: any = document.getElementsByClassName('gm-style-iw')[0].previousElementSibling;
                const nextElement: any = document.getElementsByClassName('gm-style-iw')[0].nextElementSibling;
    
                preElement.children[1].style.display = 'none';
                preElement.children[3].style.display = 'none';
                nextElement.className = 'iw-close';
            }, 100);
        });
    }

    private createComponent(): ComponentRef<IInfoWindowComponent> {
        const factory = this.componentFactoryResolver.resolveComponentFactory(IInfoWindowComponent);
        const ref = this.viewContainerRef.createComponent(factory);
        ref.changeDetectorRef.detectChanges();

        return ref;
    }
}
