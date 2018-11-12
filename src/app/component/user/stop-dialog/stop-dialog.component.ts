import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { MapsAPILoader } from '@agm/core';

import { UploadFileComponent } from '../../common/upload-file/upload-file.component';
import { ItineraryService } from '../../../service/itinerary.service';

import { Picture } from '../../../model/picture';
import { Stop } from '../../../model/stop';

declare var google: any;

@Component({
    selector: 'app-stop-dialog',
    templateUrl: './stop-dialog.component.html',
    styleUrls: ['./stop-dialog.component.scss'],
    providers: [UploadFileComponent]

})
export class StopDialogComponent implements OnInit {
    newStop: Stop = new Stop();
    isUpdate = false;
    isLoading = false;
    images: Array<Picture> = [];

    screenHeight: number;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    city: FormControl;
    date: FormControl;
    description: FormControl;
    form: FormGroup;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public snackBar: MatSnackBar,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<StopDialogComponent>,
        private itineraryService: ItineraryService) {
        this.city = new FormControl('', [Validators.required, Validators.minLength(2)]);
        this.date = new FormControl('', [Validators.required]);
        this.description = new FormControl('', [Validators.required, Validators.minLength(3)]);

        this.form = this.fb.group({
            city: this.city,
            date: this.date,
            description: this.description
        });

        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;

        window.onresize = (e) => {
            // ngZone.run will help to run change detection
            this.ngZone.run(() => {
                this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
            });
        };
    }

    ngOnInit() {
        const that = this;

        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place: any = autocomplete.getPlace();

                    that.city.setValue(place.name);

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    that.newStop.lat = place.geometry.location.lat();
                    that.newStop.lng = place.geometry.location.lng();
                });
            });
        });
    }

    registerStop() {
        if ((this.form.dirty || this.images.length > 0) && this.form.valid) {
            this.isLoading = true;

            if (this.isUpdate) {
                this.itineraryService.updateStop(this.newStop).subscribe(
                    id => id != null ? this.updateImages(true, -1) : function () { },
                    error => alert(error)
                );
            } else {
                this.itineraryService.createStop(this.newStop).subscribe(
                    id => id != null ? this.updateImages(false, id.id) : function () { },
                    error => alert(error)
                );
            }
        }
        return false;
    }
    getCurrentPosition() {
        const that = this;

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const d = new Date();

                this.newStop.date = d.getFullYear() + '-' + this.completeNumberWithZero(d.getMonth() + 1) + '-' + this.completeNumberWithZero(d.getDate());
                this.newStop.lat = position.coords.latitude;
                this.newStop.lng = position.coords.longitude;

                const geocoder = new google.maps.Geocoder();

                geocoder.geocode({
                    'latLng': { lat: position.coords.latitude, lng: position.coords.longitude }
                }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            that.city.setValue(results[1].formatted_address);
                            that.newStop.city = results[1].formatted_address;
                            that.searchElementRef.nativeElement.focus();
                        } else {
                            alert('Aucun résultat trouvé :(');
                        }
                    } else {
                        alert('Aucun résultat trouvé :(');
                    }
                });
            });
        }
    }
    private updateImages(updated: boolean, stopId: number) {
        const that = this;

        if (this.images.length > 0) {
            if (stopId != -1) {
                this.images.map(i => i.stopId = stopId);
            }

            this.images.map(i => (i.caption = (i.caption == null ? '' : i.caption)));

            this.itineraryService.updateImages(this.images).subscribe(
                id => updated ? that.successfullyUpdated() : that.successfullyCreated(),
                error => alert(error)
            );
        } else {
            if (updated) {
                this.successfullyUpdated();
            } else {
                this.successfullyCreated();
            }
        }
    }

    private successfullyCreated() {
        this.isLoading = false;
        this.snackBar.open('Félicitation votre free-stop a bien été créée', 'Ok', {
            duration: 3000
        });

        const that = this;
        setTimeout(function () {
            that.newStop = new Stop();
            that.dialogRef.close();
        }, 500);
    }
    private successfullyUpdated() {
        this.isLoading = false;
        this.snackBar.open('Félicitation votre free-stop a bien été modifiée', 'Ok', {
            duration: 3000
        });

        const that = this;
        setTimeout(function () {
            that.newStop = new Stop();
            that.dialogRef.close();
        }, 500);
    }
    private completeNumberWithZero(number: number): string {
        if ((number + '').length === 1) {
            return '0' + number + '';
        } else {
            return '' + number;
        }
    }
}
