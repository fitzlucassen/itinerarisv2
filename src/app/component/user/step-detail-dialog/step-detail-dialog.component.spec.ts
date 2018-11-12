import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDetailDialogComponent } from './step-detail-dialog.component';

describe('StepDetailDialogComponent', () => {
    let component: StepDetailDialogComponent;
    let fixture: ComponentFixture<StepDetailDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StepDetailDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StepDetailDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
