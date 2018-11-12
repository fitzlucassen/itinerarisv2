import { Component, OnInit, ViewChild, ElementRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { MapsAPILoader } from '@agm/core';
import { Itinerary } from '../../../model/itinerary';
import { ItineraryService } from '../../../service/itinerary.service';

declare var google: any;

@Component({
    selector: 'app-itinerary-dialog',
    templateUrl: './itinerary-dialog.component.html',
    styleUrls: ['./itinerary-dialog.component.scss'],
    providers: [MatDialog, ItineraryService]
})
export class ItineraryDialogComponent implements OnInit {
    newItinerary: Itinerary = new Itinerary();
    isUpdate = false;
    isLoading = false;
    onlineChanges = false;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    name: FormControl;
    country: FormControl;
    description: FormControl;
    form: FormGroup;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public snackBar: MatSnackBar,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ItineraryDialogComponent>,
        private itineraryService: ItineraryService) {
        this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.country = new FormControl('', [Validators.required]);
        this.description = new FormControl('', [Validators.required, Validators.minLength(3)]);

        this.form = this.fb.group({
            name: this.name,
            country: this.country,
            description: this.description,
        });
    }

    ngOnInit() {
        const that = this;

        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['geocode']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place: any = autocomplete.getPlace();

                    that.country.setValue(place.name);

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                });
            });
        });
    }

    registerItinerary() {
        if ((this.onlineChanges || this.form.dirty) && this.form.valid) {
            this.isLoading = true;

            if (this.isUpdate) {
                this.itineraryService.update(this.newItinerary).subscribe(
                    id => id != null ? this.successfullyUpdated() : function () { },
                    error => alert(error)
                );
            } else {
                this.itineraryService.create(this.newItinerary).subscribe(
                    id => id != null ? this.successfullyCreated() : function () { },
                    error => alert(error)
                );
            }
        }
        return false;
    }

    updateOnline() {
        this.newItinerary.online = !this.newItinerary.online;
        this.onlineChanges = true;
    }

    private successfullyCreated() {
        this.snackBar.open('Félicitation votre itinéraire a bien été créé', 'Ok', {
            duration: 3000
        });
        this.isLoading = false;

        const that = this;
        setTimeout(function () {
            that.newItinerary = new Itinerary();
            that.dialogRef.close();
        }, 500);
    }

    private successfullyUpdated() {
        this.snackBar.open('Félicitation votre itinéraire a bien été modifié', 'Ok', {
            duration: 3000
        });
        this.isLoading = false;

        const that = this;
        setTimeout(function () {
            that.newItinerary = new Itinerary();
            that.dialogRef.close();
        }, 500);
    }
}
