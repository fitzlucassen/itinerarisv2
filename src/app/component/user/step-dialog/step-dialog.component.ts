import { Component, OnInit, OnChanges, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';

import { ItineraryStep } from '../../../model/itinerary-step';
import { ItineraryService } from '../../../service/itinerary.service';
import { MapsService } from '../../../service/maps.service';
import { UploadFileComponent } from '../../common/upload-file/upload-file.component';
import { Picture } from '../../../model/picture';
import { StepDetail } from '../../../model/step-detail';
import { ItineraryDetailService } from '../../../service/itineraryDetail.service';
import { StepDetailDialogComponent } from '../step-detail-dialog/step-detail-dialog.component';

declare var google: any;

@Component({
    selector: 'app-step-dialog',
    templateUrl: './step-dialog.component.html',
    styleUrls: ['./step-dialog.component.scss'],
    providers: [UploadFileComponent, MapsService, ItineraryDetailService]
})
export class StepDialogComponent implements OnInit, OnChanges {
    newStep: ItineraryStep = new ItineraryStep();
    stepDetails: Array<StepDetail> = new Array<StepDetail>();
    isUpdate = false;
    isLoading = false;
    isShown = false;
    images: Array<Picture> = [];

    screenHeight: number;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    city: FormControl;
    date: FormControl;
    description: FormControl;
    type: FormControl;
    form: FormGroup;

    stepDetailDialogRef: MatDialogRef<StepDetailDialogComponent>;

    constructor(
        public itineraryDialog: MatDialog,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public snackBar: MatSnackBar,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<StepDialogComponent>,
        private itineraryService: ItineraryService,
        private itineraryDetailService: ItineraryDetailService,
        private mapsService: MapsService) {
        this.city = new FormControl('', [Validators.required, Validators.minLength(2)]);
        this.date = new FormControl('', [Validators.required]);
        this.description = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.type = new FormControl('', [Validators.required]);

        this.form = this.fb.group({
            city: this.city,
            date: this.date,
            description: this.description,
            type: this.type
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
                    that.newStep.lat = place.geometry.location.lat();
                    that.newStep.lng = place.geometry.location.lng();
                });
            });
        });
    }

    ngOnChanges(e) {
        console.log(e);
    }

    registerStep() {
        if ((this.form.dirty || this.images.length > 0) && this.form.valid) {
            this.isLoading = true;

            if (this.isUpdate) {
                this.itineraryService.updateStep(this.newStep).subscribe(
                    id => id != null ? this.updateImages(true, -1) : function () { },
                    error => alert(error)
                );
            } else {
                this.itineraryService.createStep(this.newStep).subscribe(
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
                that.fillFormWithGeolocalisation(position.coords.latitude, position.coords.longitude);
            }, function () {
                that.mapsService.getCurrentPosition().subscribe(
                    data => {
                        that.fillFormWithGeolocalisation(data.location.lat, data.location.lng);
                    }
                );
            });
        }
    }

    showDetails() {
        this.isShown = true;
        return false;
    }

    removeStepDetail(id: number) {
        if (confirm('Êtes-vous sur de vouloir supprimer ce détail ?' + id)) {
            this.itineraryDetailService.removeStepDetail(id).subscribe(
                id => id != null ? this.successfullyRemovedDetail(id) : function () { }
            );
        }
    }

    editStepDetail(id: number) {
        const stepDetail = this.stepDetails.find(s => s.id === id);

        this.stepDetailDialogRef = this.itineraryDialog.open(StepDetailDialogComponent, {
            disableClose: false,
        });
        this.stepDetailDialogRef.componentInstance.itineraryId = this.newStep.itineraryId;
        this.stepDetailDialogRef.componentInstance.stepDetailCurrency = 'EUR';
        this.stepDetailDialogRef.componentInstance.stepDetailType = stepDetail.type;
        this.stepDetailDialogRef.componentInstance.stepId = this.newStep.id;
        this.stepDetailDialogRef.componentInstance.stepDetail = stepDetail;
        this.stepDetailDialogRef.componentInstance.search = this.newStep.city;
        this.stepDetailDialogRef.componentInstance.searchCurrency = 'EUR';
        // TODO: subscribe to close event and udpate list data
    }

    private fillFormWithGeolocalisation(latitude: number, longitude: number) {
        const d = new Date();

        this.newStep.date = d.getFullYear() + '-' + this.completeNumberWithZero(d.getMonth() + 1) + '-' + this.completeNumberWithZero(d.getDate());
        this.newStep.lat = latitude;
        this.newStep.lng = longitude;

        const geocoder = new google.maps.Geocoder();

        const that = this;

        geocoder.geocode({
            'latLng': { lat: latitude, lng: longitude }
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    that.city.setValue(results[1].formatted_address);
                    that.newStep.city = results[1].formatted_address;
                    that.searchElementRef.nativeElement.focus();
                } else {
                    alert('Aucun résultat trouvé :(');
                }
            } else {
                alert('Aucun résultat trouvé :(');
            }
        });
    }
    private updateImages(updated: boolean, stepId: number) {
        const that = this;

        if (this.images.length > 0) {
            if (stepId != -1) {
                this.images.map(i => i.stepId = stepId);
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
        this.snackBar.open('Félicitation votre étape a bien été créée', 'Ok', {
            duration: 3000
        });

        const that = this;
        setTimeout(function () {
            that.newStep = new ItineraryStep();
            that.dialogRef.close();
        }, 500);
    }
    private successfullyUpdated() {
        this.isLoading = false;
        this.snackBar.open('Félicitation votre étape a bien été modifiée', 'Ok', {
            duration: 3000
        });

        const that = this;
        setTimeout(function () {
            that.newStep = new ItineraryStep();
            that.dialogRef.close();
        }, 500);
    }
    private successfullyRemovedDetail(id: number){
        this.snackBar.open('Félicitation ce détail a bien été supprimé', 'Ok', {
            duration: 3000
        });
        this.stepDetails.splice(this.stepDetails.findIndex(s => s.id === id), 1);
    }
    private completeNumberWithZero(number: number): string {
        if ((number + '').length === 1) {
            return '0' + number + '';
        } else {
            return '' + number;
        }
    }
}
