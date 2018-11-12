import { Component, OnInit, NgZone, Input } from '@angular/core';

@Component({
    selector: 'app-sharing-dialog',
    templateUrl: './sharing-dialog.component.html',
    styleUrls: ['./sharing-dialog.component.scss']
})
export class SharingDialogComponent implements OnInit {
    screenHeight: number;

    sharingUrl: string = '';
    sharingTitle: string = '';
    sharingDescription: string = '';

    constructor(private ngZone: NgZone) {
        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;

        window.onresize = (e) => {
            // ngZone.run will help to run change detection
            this.ngZone.run(() => {
                this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
            });
        };
    }

    ngOnInit() {
    }

}
