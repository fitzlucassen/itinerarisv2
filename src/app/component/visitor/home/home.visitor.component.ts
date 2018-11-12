import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { ItineraryService } from '../../../service/itinerary.service';
import { StorageService } from '../../../service/storage.service';
import { Itinerary } from '../../../model/itinerary';
import { SearchItineraryPipe } from '../../../pipe/search-itinerary.pipe';
import { SearchMapComponent } from '../search-map/search-map.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.visitor.component.html',
    styleUrls: ['./home.visitor.component.scss'],
    providers: [ItineraryService, SearchMapComponent, StorageService]
})
export class HomeVisitorComponent implements OnInit {
    searchText: string;
    search: FormControl;
    form: FormGroup;
    screenHeight: number;

    @ViewChild(SearchMapComponent) public map: SearchMapComponent;

    isMap = false;

    itineraries: Array<Itinerary> = [];

    constructor(private fb: FormBuilder, private itineraryService: ItineraryService, private storageService: StorageService, private router: Router, private metaService: Meta, private titleService: Title) {
        this.titleService.setTitle('Trouvez un itinéraire de voyage');
        this.metaService.updateTag({ content: 'Trouvez un itinéraire de voyage' }, 'property="og:title"');
        this.metaService.updateTag({ content: 'Recherchez l\'itinéraire de voyage d\'un de vos proches ou l\'itinéraire d\'un voyageur qui a déjà traversé le pays que vous convoitez pour vos prochaines vacances !' }, 'name="description"');
        this.metaService.updateTag({ content: 'Recherchez l\'itinéraire de voyage d\'un de vos proches ou l\'itinéraire d\'un voyageur qui a déjà traversé le pays que vous convoitez pour vos prochaines vacances !' }, 'property="og:description"');

        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;

        this.search = new FormControl('', []);
        this.form = this.fb.group({
            search: this.search,
        });

        const that = this;
        this.itineraryService.getItineraries().subscribe(
            result => that.assignItineraries(result),
            error => alert(error)
        );
    }

    replaceAll(str: string, replace: string, value: string): string {
        return str.replace(new RegExp(replace, 'g'), value);
    }

    toggleIsMap() {
        this.isMap = !this.isMap;

        if (this.isMap) {
            this.map.loadMap();
        } else {
            this.map.unloadMap();
        }
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

    ngOnInit() {
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

    private assignItineraries(result: Array<Itinerary>) {
        this.itineraries = result.sort(this.sorter);
    }

    private sorter(a: Itinerary, b: Itinerary) {
        if (a.nbStep < b.nbStep) {
            return 1;
        } else if (a.nbStep > b.nbStep) {
            return -1;
        } else {
            return 0;
        }
    }
}
