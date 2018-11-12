import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryUserDialogComponent } from './itinerary-user-dialog.component';

describe('ItineraryUserDialogComponent', () => {
    let component: ItineraryUserDialogComponent;
    let fixture: ComponentFixture<ItineraryUserDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ItineraryUserDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ItineraryUserDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
