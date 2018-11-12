import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ItineraryStep } from '../../../model/itinerary-step';
import { Stop } from '../../../model/stop';
import { MapComponent } from '../map/map.component';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { SharingDialogComponent } from '../../common/sharing-dialog/sharing-dialog.component';

@Component({
    selector: 'app-world-map',
    templateUrl: './world-map.component.html',
    styleUrls: ['./world-map.component.scss'],
    providers: [ItineraryService]
})
export class WorldMapComponent implements OnInit, OnDestroy {
    steps: Array<Array<ItineraryStep>>;
    stops: Array<Stop>;

    title: string;
    screenHeight: number;
    totalShare = 0;
    sharingRef: MatDialogRef<SharingDialogComponent>;

    currentUrl: string;
    currentTitle = 'Les voyages';
    currentDescription = 'Visualisation des itinéraires de voyage';

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
            const userId = params['iduser'];
            const userName = params['nameuser'];

            this.title = userName;

            this.currentTitle += ' de ' + userName;
            this.currentDescription += ' de ' + userName;

            this.titleService.setTitle(this.currentTitle);
            this.metaService.updateTag({ content: this.currentTitle }, 'property="og:title"');
            this.metaService.updateTag({ content: this.currentDescription }, 'name="description"');
            this.metaService.updateTag({ content: this.currentDescription }, 'property="og:description"');

            const that = this;

            this.itineraryService.getItinerariesSteps(userId).subscribe(
                result => that.assignItinerarySteps(result),
                error => alert(error)
            );
            this.itineraryService.getItinerariesStops(userId).subscribe(
                result => that.assignItineraryStops(result),
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

        this.sharingRef.componentInstance.sharingUrl = this.currentUrl;
        this.sharingRef.componentInstance.sharingTitle = 'Tous les Itinéraires de voyage de ' + userName;
        this.sharingRef.componentInstance.sharingDescription = 'Voici tous les itinéraires de voyage de ' + userName + ' - Restez en contact avec lui et laissez lui un message !';
    }

    private assignItinerarySteps(result: Array<Array<ItineraryStep>>) {
        this.steps = result;

        this.map.drawItineraries(this.steps);
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
