import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatInput } from '@angular/material';
import { Meta, Title } from '@angular/platform-browser';

import { Itinerary } from '../../../model/itinerary';
import { ItineraryStep } from '../../../model/itinerary-step';
import { User } from '../../../model/user';
import { Stop } from '../../../model/stop';
import { ItineraryService } from '../../../service/itinerary.service';
import { UserService } from '../../../service/user.service';
import { StepDialogComponent } from '../step-dialog/step-dialog.component';
import { StopDialogComponent } from '../stop-dialog/stop-dialog.component';
import { SharingDialogComponent } from '../../common/sharing-dialog/sharing-dialog.component';
import { ItineraryUserDialogComponent } from '../itinerary-user-dialog/itinerary-user-dialog.component';
import { StepDetailDialogComponent } from '../step-detail-dialog/step-detail-dialog.component';

import { environment } from '../../../../environments/environment';
import { StepDetail } from '../../../model/step-detail';
import { ItineraryDetailService } from '../../../service/itineraryDetail.service';

@Component({
    selector: 'app-user-itinerary',
    templateUrl: './itinerary.user.component.html',
    styleUrls: ['./itinerary.user.component.scss'],
    providers: [ItineraryService, UserService, ItineraryDetailService, MatDialog]
})
export class ItineraryUserComponent implements OnInit {
    currentItinerary: Itinerary;
    currentUser: User;
    itinerarySteps: Array<ItineraryStep>;
    itineraryStops: Array<Stop>;

    dialogRef: MatDialogRef<StepDialogComponent>;
    dialogRefStop: MatDialogRef<StopDialogComponent>;
    sharingRef: MatDialogRef<SharingDialogComponent>;
    contributorRef: MatDialogRef<ItineraryUserDialogComponent>;
    stepDetailDialogRef: MatDialogRef<StepDetailDialogComponent>;

    showSearch: boolean;
    isStop = false;
    search: string;
    screenHeight: number;
    mapUrl: string;

    source: any;

    @ViewChild(MatInput) input: any;
    @ViewChild('start') el: any;

    constructor(
        public itineraryDialog: MatDialog,
        public route: ActivatedRoute,
        private itineraryService: ItineraryService,
        private stepDetailService: ItineraryDetailService,
        private userService: UserService,
        private router: Router,
        private metaService: Meta,
        private titleService: Title) {
        this.titleService.setTitle('Itineraris -  Gérer l\'itinéraire');
        this.metaService.updateTag({ content: 'Itineraris - Gérer l\'itinéraire' }, 'property="og:title"');
        this.metaService.updateTag({ content: 'Gérer votre itinéraire en ajoutant une ou plusieurs étapes' }, 'name="description"');
        this.metaService.updateTag({ content: 'Gérer votre itinéraire en ajoutant une ou plusieurs étapes' }, 'property="og:description"');

        this.currentUser = userService.getCurrentUser();
        this.showSearch = false;
        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
    }

    toggleSearch() {
        this.showSearch = !this.showSearch;

        setTimeout(() => {
            this.input.focus();
        });
    }

    toggleIsStop(isStop: boolean) {
        this.isStop = isStop;
    }

    openDialog() {
        this.dialogRef = this.itineraryDialog.open(StepDialogComponent, {
            disableClose: false,
        });
        this.dialogRef.componentInstance.newStep.itineraryId = this.currentItinerary.id;

        if (this.itinerarySteps.length === 0) {
            this.dialogRef.componentInstance.type.disable();
        }

        const that = this;
        return this.dialogRef.afterClosed().subscribe(function () {
            that.itineraryService.getItinerarySteps(that.currentItinerary.id).subscribe(
                result => that.assignItinerarySteps(result),
                error => alert(error)
            );
        });
    }

    opencontributorPopup() {
        this.contributorRef = this.itineraryDialog.open(ItineraryUserDialogComponent, {
            disableClose: false,
        });
        this.contributorRef.componentInstance.usedUsers = this.currentItinerary.users;
        this.contributorRef.componentInstance.currentItinerary = this.currentItinerary;
    }

    openSharingPopup() {
        this.sharingRef = this.itineraryDialog.open(SharingDialogComponent, {
            disableClose: false,
        });

        const userName = this.currentUser.name;
        const country = this.currentItinerary.country;

        this.sharingRef.componentInstance.sharingUrl = environment.url + '/visiteur/' + this.mapUrl;
        this.sharingRef.componentInstance.sharingTitle = 'Itinéraire de voyage de ' + userName + ' - ' + country;
        this.sharingRef.componentInstance.sharingDescription = 'Voici l\'itinéraire de voyage de ' + userName + ' - ' + country + ' - Restez en contact avec lui et laissez lui un message !';
    }

    openFreeStopDialog() {
        this.dialogRefStop = this.itineraryDialog.open(StopDialogComponent, {
            disableClose: false,
        });
        this.dialogRefStop.componentInstance.newStop.itineraryId = this.currentItinerary.id;

        const that = this;
        return this.dialogRefStop.afterClosed().subscribe(function () {
            that.itineraryService.getItineraryStops(that.currentItinerary.id).subscribe(
                result => that.assignItineraryStops(result),
                error => alert(error)
            );
        });
    }

    openStepDetailDialog() {
        this.stepDetailDialogRef = this.itineraryDialog.open(StepDetailDialogComponent, {
            disableClose: false,
        });
        this.stepDetailDialogRef.componentInstance.itineraryId = this.currentItinerary.id;
    }

    editStep(id: string) {
        this.dialogRef = this.itineraryDialog.open(StepDialogComponent, {
            disableClose: false,
        });
        this.itineraryService.getStepById(id).subscribe(
            result => result != null ? this.assignItineraryStep(result) : function () { },
            error => alert(error)
        );
        this.stepDetailService.getStepDetails(id).subscribe(
            result => result != null ? this.assignItineraryStepDetails(result) : function () { },
            error => alert(error)
        );
        this.dialogRef.componentInstance.isUpdate = true;

        const that = this;
        return this.dialogRef.afterClosed().subscribe(function () {
            that.itineraryService.getItinerarySteps(that.currentItinerary.id).subscribe(
                result => that.assignItinerarySteps(result),
                error => alert(error)
            );
        });
    }

    editStop(id: string) {
        this.dialogRefStop = this.itineraryDialog.open(StopDialogComponent, {
            disableClose: false,
        });
        this.itineraryService.getStopById(id).subscribe(
            result => result != null ? this.assignItineraryStop(result) : function () { },
            error => alert(error)
        );
        this.dialogRefStop.componentInstance.isUpdate = true;

        const that = this;
        return this.dialogRefStop.afterClosed().subscribe(function () {
            that.itineraryService.getItineraryStops(that.currentItinerary.id).subscribe(
                result => that.assignItineraryStops(result),
                error => alert(error)
            );
        });
    }

    removeStep(id: number) {
        if (confirm('Êtes-vous sur de vouloir supprimer cette étape ?')) {
            this.itineraryService.deleteStep(id).subscribe(
                id => id != null ? this.successfullyRemoved() : function () { }
            );
        }
    }

    removeStop(id: number) {
        if (confirm('Êtes-vous sur de vouloir supprimer ce free-stop ?')) {
            this.itineraryService.deleteStop(id).subscribe(
                id => id != null ? this.successfullyRemovedFreeStop() : function () { }
            );
        }
    }

    replaceAll(str: string, replace: string, value: string): string {
        return str.replace(new RegExp(replace, 'g'), value);
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

    signout() {
        this.userService.signout(this.currentUser, function () { window.location.href = '/'; });
    }

    /***************/
    /* Drag n drop */
    /***************/
    isbefore(a, b) {
        if (a.parentNode == b.parentNode) {
            for (let cur = a; cur; cur = cur.previousSibling) {
                if (cur === b) {
                    return true;
                }
            }
        }
        return false;
    }
    dragenter($event) {
        const target = $event.currentTarget;
        if (this.isbefore(this.source, target)) {
            target.parentNode.insertBefore(this.source, target); // insert before

        } else {
            target.parentNode.insertBefore(this.source, target.nextSibling); // insert after
        }
    }
    dragstart($event) {
        this.source = $event.currentTarget;
        $event.dataTransfer.effectAllowed = 'move';
    }
    drop($event: any, step: ItineraryStep) {
        $event.preventDefault();

        const list = $event.path[1].children;
        const that = this;

        let cpt = 0;
        for (const i in list) {
            if (list.hasOwnProperty(i)) {
                const id = list[i].id;
                const stepId = id.split('-')[1];

                that.itinerarySteps.find(s => s.id == stepId).position = cpt++;
                that.itinerarySteps.find(s => s.id == stepId).date = that.itinerarySteps.find(s => s.id == stepId).date.split('T')[0];
            }
        }

        that.itineraryService.updateSteps(that.itinerarySteps).subscribe(
            data => { },
            error => { alert(error); }
        );
    }
    dropStop($event: any, stop: Stop) {
        $event.preventDefault();

        const list = $event.path[1].children;
        const that = this;

        let cpt = 0;
        for (const i in list) {
            if (list.hasOwnProperty(i)) {
                const id = list[i].id;
                const stepId = id.split('-')[1];

                that.itineraryStops.find(s => s.id == stepId).position = cpt++;
                that.itineraryStops.find(s => s.id == stepId).date = that.itineraryStops.find(s => s.id == stepId).date.split('T')[0];
            }
        }

        that.itineraryService.updateStops(that.itineraryStops).subscribe(
            data => { },
            error => { alert(error); }
        );
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            // Récupération des valeurs de l'URL
            const id = params['id'];
            const name = params['name'];

            this.currentItinerary = new Itinerary();

            const that = this;
            this.itineraryService.getItinerarySteps(id).subscribe(
                result => that.assignItinerarySteps(result),
                error => alert(error)
            );

            this.itineraryService.getItineraryById(id).subscribe(
                result => that.assignItinerary(result),
                error => alert(error)
            );

            this.itineraryService.getItineraryStops(id).subscribe(
                result => that.assignItineraryStops(result),
                error => alert(error)
            );
        });
    }

    private successfullyRemoved() {
        const that = this;
        this.itineraryService.getItinerarySteps(this.currentItinerary.id).subscribe(
            result => that.assignItinerarySteps(result),
            error => alert(error)
        );
    }
    private successfullyRemovedFreeStop() {
        const that = this;
        this.itineraryService.getItineraryStops(this.currentItinerary.id).subscribe(
            result => that.assignItineraryStops(result),
            error => alert(error)
        );
    }
    private assignItinerary(result: Itinerary) {
        this.currentItinerary = result;
        this.el.toggle();

        this.mapUrl =
            this.sanitize(this.currentUser.name) + '/' +
            this.currentItinerary.id + '/' +
            this.sanitize(this.currentItinerary.name);
    }
    private assignItinerarySteps(result: Array<ItineraryStep>) {
        this.itinerarySteps = result;
    }
    private assignItineraryStops(result: Array<Stop>) {
        this.itineraryStops = result;
    }
    private assignItineraryStep(step: ItineraryStep) {
        const d = step.date.split('T')[0].split('-');

        step.date = d[0] + '-' + d[1] + '-' + d[2];

        this.dialogRef.componentInstance.newStep = step;
    }
    private assignItineraryStepDetails(stepDetails: Array<StepDetail>) {
        this.dialogRef.componentInstance.stepDetails = stepDetails;
    }
    private assignItineraryStop(stop: Stop) {
        const d = stop.date.split('T')[0].split('-');

        stop.date = d[0] + '-' + d[1] + '-' + d[2];

        this.dialogRefStop.componentInstance.newStop = stop;
    }
}
