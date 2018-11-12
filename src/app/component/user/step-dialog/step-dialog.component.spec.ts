/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StepDialogComponent } from './step-dialog.component';

describe('StepDialogComponent', () => {
    let component: StepDialogComponent;
    let fixture: ComponentFixture<StepDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StepDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StepDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
