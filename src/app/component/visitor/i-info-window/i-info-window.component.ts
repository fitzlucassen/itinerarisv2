import { Component, OnInit, ElementRef, ViewChild, Injectable, AfterViewChecked } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material';

import { Picture } from '../../../model/picture';
import { environment } from '../../../../environments/environment';
import { StepDetail } from '../../../model/step-detail';

declare var google: any;

@Component({
    selector: 'app-i-info-window',
    templateUrl: './i-info-window.component.html',
    styleUrls: ['./i-info-window.component.scss']
})
export class IInfoWindowComponent implements OnInit, AfterViewChecked {
    title = '';
    date = '';
    description = '';
    mainPictureUrl = '';
    mainPictureCaption = '';
    pictures: Array<Picture>;
    astuces: Array<StepDetail>;

    isTherePictures = false;
    isSumupTabActive = true;
    serviceUrl: string;
    mainContainer: ElementRef;

    @ViewChild(MatTabGroup)
    tabGroup: MatTabGroup;

    lat: number;
    lng: number;
    infoWindow: any;

    constructor(currentElement: ElementRef) {
        this.mainContainer = currentElement;
    }

    toggleSumup($event: MouseEvent) {
        let currentIndex = 0;

        if ($event.srcElement.className.indexOf('tab-header') >= 0) {
            for (let i = 0; i < $event.srcElement.parentElement.children.length; i++) {
                $event.srcElement.parentElement.children.item(i).classList.remove('active');

                if ($event.srcElement == $event.srcElement.parentElement.children.item(i)) {
                    currentIndex = i;
                }
            }

            $event.srcElement.classList.add('active');

            let leftIndex = $event.srcElement.clientWidth == 140 ? 140 : 160;

            console.log($event.srcElement.clientWidth);
            $event.srcElement.parentElement.children.item($event.srcElement.parentElement.children.length - 1).setAttribute('style', 'left: ' + currentIndex * leftIndex + 'px');

            const bodies = $event.srcElement.parentElement.parentElement.lastElementChild.children;

            for (let i = 0; i < bodies.length; i++) {
                bodies.item(i).classList.remove('active');
            }

            bodies.item(currentIndex).classList.add('active');
        } else {
            $event.srcElement.parentElement.click();
        }
    }

    create(lat: number, lng: number, title: string, date: string, description: string, details: Array<StepDetail>, pictures: Array<Picture>) {
        this.title = title;
        this.date = date.split('T')[0];
        this.description = description;
        this.astuces = details;
        this.pictures = pictures;
        this.lat = lat;
        this.lng = lng;

        this.isTherePictures = pictures != null && pictures.length > 0;

        if (this.isTherePictures) {
            this.mainPictureUrl = this.serviceUrl + '/' + pictures[0].url;
            this.mainPictureCaption = pictures[0].caption;
        } else {
            this.mainPictureUrl = '/assets/images/default.png';
        }

        this.infoWindow = new google.maps.InfoWindow({
            content: this.mainContainer.nativeElement,
            position: { lat: this.lat, lng: this.lng }
        });
    }

    ngOnInit(): void {
        this.serviceUrl = environment.apiUrl;
    }

    ngAfterViewChecked(): void {
    }

    open(map: any, marker: any) {
        this.infoWindow.open(map, marker);
    }

    close() {
        this.infoWindow.close();
    }

    getHtmlContent(): string {
        return this.mainContainer.nativeElement;
    }
}
