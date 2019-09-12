import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { ItineraryStep } from '../../../model/itinerary-step';
import { Stop } from '../../../model/stop';
import { MapComponent } from '../map/map.component';
import { UserService } from '../../../service/user.service';
import { ItineraryService } from '../../../service/itinerary.service';
import { SharingDialogComponent } from '../../common/sharing-dialog/sharing-dialog.component';
import { Itinerary } from 'src/app/model/Itinerary';
import { User } from 'src/app/model/user';
import { StorageService } from 'src/app/service/storage.service';

@Component({
    selector: 'app-world-map',
    templateUrl: './world-map.component.html',
    styleUrls: ['./world-map.component.scss'],
    providers: [ItineraryService, StorageService]
})
export class WorldMapComponent implements OnInit, OnDestroy {
    steps: Array<Array<ItineraryStep>>;
    stops: Array<Stop>;
    itineraries: Array<Itinerary>;

    countries: Array<string>;
    countryString: string = '';
    stepString: string = '';

    title: string;
    searchText: string;
    search: FormControl;
    form: FormGroup;
    screenHeight: number;
    totalShare = 0;
    sharingRef: MatDialogRef<SharingDialogComponent>;

    currentUrl: string;
    currentTitle = 'Les voyages';
    currentDescription = 'Visualisation des itinéraires de voyage';

    @ViewChild('toAppend') public sidenav: ElementRef;

    constructor(
        private fb: FormBuilder, 
        public itineraryDialog: MatDialog,
        public route: ActivatedRoute,
        private storageService: StorageService,
        private userService: UserService,
        private itineraryService: ItineraryService,
        private router: Router,
        private renderer: Renderer, private metaService: Meta, private titleService: Title) {

        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
        this.currentUrl = window.location.href;

        this.search = new FormControl('', []);
        this.form = this.fb.group({
            search: this.search,
        });
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

            this.itineraryService.getUserItineraries(new User({ id: userId })).subscribe(
                result => that.assignItineraries(result),
                error => alert(error)
            )
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

    sanitize(str: string): string {
        if (!str || str.length === 0) {
            return str;
        }

        let tmp = this.replaceAll(str.toLocaleLowerCase().trim(), ' ', '-');
        tmp = this.replaceAll(tmp, '[^a-z0-9éèàôûîïêù]', '-');
        tmp = this.replaceAll(tmp, '[--]+', '-');

        return encodeURIComponent(tmp);
    }

    replaceAll(str: string, replace: string, value: string): string {
        return str.replace(new RegExp(replace, 'g'), value);
    }

    isBlue(itineraryId: number): boolean {
        return this.storageService.isStored('itinerary-like', itineraryId.toString());
    }

    like(itineraryId: number) {
        if (!this.storageService.isStored('itinerary-like', itineraryId.toString())) {
            const itinerary = this.itineraries.find(i => i.id == itineraryId);
            itinerary.likes++;

            this.itineraryService.update(itinerary).subscribe(
                result => {
                    this.storageService.store('itinerary-like', itineraryId.toString());
                },
                error => alert(error)
            );
        } else {
            const itinerary = this.itineraries.find(i => i.id == itineraryId);
            itinerary.likes--;

            this.itineraryService.update(itinerary).subscribe(
                result => {
                    this.storageService.erase('itinerary-like', itineraryId.toString());
                },
                error => alert(error)
            );
        }
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

    private getCountryString() {
        var str = '';

        if(this.countries.length == 0)
            str = 'Je n\'ai pas encore visité de pays';
        else if (this.countries.length == 1)
            str = 'Pays dans lequel j\'ai déjà voyagé : <span class="cut">' + this.countries[0] + '</span>';
        else if (this.countries.length == 2)
            str = 'Pays dans lesquels j\'ai déjà voyagé : <span class="cut">' + this.countries[0] + ', ' + this.countries[1] + '</span>';
        else if (this.countries.length == 3)        
            str = 'Pays dans lesquels j\'ai déjà voyagé : <span class="cut">' + this.countries[0] + ', ' + this.countries[1] + ' et 1 autre</span>';
        else
            str = 'Pays dans lesquels j\'ai déjà voyagé : <span class="cut">' + this.countries[0] + ', ' + this.countries[1] + ' et ' + (this.countries.length - 2) + ' autres</span>';

        return str;
    }

    private getStepString() {
        var str = '';
        var cpt = 0;
        this.steps.forEach(s => { cpt = cpt + s.length; });
        
        if(this.steps.length == 0)
            str = 'Je n\'ai pas encore visité de site en particulier';
        if(this.steps.length == 1)
            str = 'J\'ai déjà visité <span class="cut">1</span> site d\'intérêt !';
        else
            str = 'J\'ai déjà visité <span class="cut">' + cpt + '</span> sites d\'intérêt !';

        return str;
    }

    private assignItineraries(result: Array<Itinerary>) {
        this.itineraries = result.filter(r => r.online);
        this.countries = this.itineraries.map(i => i.country);
        this.countryString = this.getCountryString();
    }
    private assignItinerarySteps(result: Array<Array<ItineraryStep>>) {
        this.steps = result;
        this.stepString = this.getStepString();
    }
    private assignItineraryStops(result: Array<Stop>) {
        this.stops = result;
    }
}
