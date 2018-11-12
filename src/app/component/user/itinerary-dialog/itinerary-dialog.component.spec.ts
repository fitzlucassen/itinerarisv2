/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItineraryDialogComponent } from './itinerary-dialog.component';

describe('ItineraryDialogComponent', () => {
    let component: ItineraryDialogComponent;
    let fixture: ComponentFixture<ItineraryDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ItineraryDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ItineraryDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
