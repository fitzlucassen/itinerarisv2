import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialogRef, MatDialog } from '@angular/material';

import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { User } from '../../../model/user';
import { Stop } from '../../../model/stop';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryStep } from '../../../model/itinerary-step';
import { MapComponent } from '../map/map.component';
import { SharingDialogComponent } from '../../common/sharing-dialog/sharing-dialog.component';

@Component({
    selector: 'app-user-map',
    templateUrl: './user-map.component.html',
    styleUrls: ['./user-map.component.scss'],
    providers: [ItineraryService, UserService, MapComponent],
})
export class UserMapComponent implements OnInit, OnDestroy {
    itinerary: Itinerary;
    steps: Array<ItineraryStep>;
    stops: Array<Stop>;

    title: string;
    screenHeight: number;
    totalShare = 0;

    currentUrl: string;
    currentTitle = 'Itinéraire de voyage';
    currentDescription = 'Voici l\'itinéraire de voyage';

    sharingRef: MatDialogRef<SharingDialogComponent>;

    @ViewChild(MapComponent) public map: MapComponent;
    @ViewChild('toAppend') public sidenav: ElementRef;

    constructor(
        public itineraryDialog: MatDialog,
        public route: ActivatedRoute,
        private userService: UserService,
        private itineraryService: ItineraryService,
        private router: Router,
        private renderer: Renderer, private metaService: Meta, private titleService: Title) {

        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
        this.currentUrl = window.location.href;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            // Récupération des valeurs de l'URL
            const itineraryId = params['id'];
            const itineraryName = params['name'];
            const userName = params['nameuser'];

            this.title = userName;

            this.currentTitle += ' de ' + userName;
            this.currentDescription += ' de ' + userName;

            const that = this;
            this.itineraryService.getItinerarySteps(itineraryId).subscribe(
                result => that.assignItinerarySteps(result),
                error => alert(error)
            );
            this.itineraryService.getItineraryStops(itineraryId).subscribe(
                result => that.assignItineraryStops(result),
                error => alert(error)
            );

            this.itineraryService.getItineraryById(itineraryId).subscribe(
                result => that.assignItinerary(result),
                error => alert(error)
            );

            this.renderer.setElementProperty(this.sidenav.nativeElement, 'innerHTML', '<div id="fb-root"></div><div class="fb-comments" data-href="' + this.currentUrl + '" data-numposts="10"></div>');

            (function (d, s, id) {
                // tslint:disable-next-line:prefer-const
                let js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id) && window['FB']) {
                    window['FB'].XFBML.parse(); // Instead of returning, lets call parse()
                }
                js = d.createElement(s); js.id = id;
                js.src = '//connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.8&appId=265963237186602';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        });
    }

    ngOnDestroy() {
        delete window['FB'];
    }

    openSharingPopup() {
        this.sharingRef = this.itineraryDialog.open(SharingDialogComponent, {
            disableClose: false,
        });

        const userName = this.title;
        const country = this.itinerary.country;

        this.sharingRef.componentInstance.sharingUrl = this.currentUrl;
        this.sharingRef.componentInstance.sharingTitle = 'Itinéraire de voyage de ' + userName + ' - ' + country;
        this.sharingRef.componentInstance.sharingDescription = 'Voici l\'itinéraire de voyage de ' + userName + ' - ' + country + ' - Restez en contact avec lui et laissez lui un message !';
    }

    private assignItinerary(result: Itinerary) {
        this.currentTitle += ' - ' + result.country;
        this.currentDescription += ' - ' + result.country + ' - Restez en contact avec lui et laissez lui un message !';

        this.titleService.setTitle(this.currentTitle);
        this.metaService.updateTag({ content: this.currentTitle }, 'property="og:title"');
        this.metaService.updateTag({ content: this.currentDescription }, 'name="description"');
        this.metaService.updateTag({ content: this.currentDescription }, 'property="og:description"');

        this.itinerary = result;
    }
    private assignItinerarySteps(result: Array<ItineraryStep>) {
        this.steps = result;
        let origin = {};
        let destination = {};
        let waypoints = {};

        if (this.steps.length > 0) {
            origin = {
                latitude: this.steps[0].lat,
                longitude: this.steps[0].lng,
                object: this.steps[0]
            };
        }
        if (this.steps.length > 1) {
            destination = {
                latitude: this.steps[this.steps.length - 1].lat,
                longitude: this.steps[this.steps.length - 1].lng,
                object: this.steps[this.steps.length - 1]
            };

            waypoints = this.steps;
        }
        this.map.updateDirections(origin, destination, waypoints);
    }
    private assignItineraryStops(result: Array<Stop>) {
        this.stops = result;

        const that = this;
        this.stops.forEach(function (element: Stop) {
            that.itineraryService.getStopPictures(element.id).subscribe(
                data => { that.map.createInfoWindowForStop(data, element); },
                error => { alert(error); }
            );
        });
    }
}
