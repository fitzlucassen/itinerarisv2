/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItineraryUserComponent } from './itinerary.user.component';

describe('ItineraryComponent', () => {
    let component: ItineraryUserComponent;
    let fixture: ComponentFixture<ItineraryUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ItineraryUserComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ItineraryUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
