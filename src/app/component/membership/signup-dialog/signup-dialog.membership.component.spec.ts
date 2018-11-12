/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SignUpDialogComponent } from './signup-dialog.membership.component';

describe('SignupComponent', () => {
    let component: SignUpDialogComponent;
    let fixture: ComponentFixture<SignUpDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignUpDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignUpDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
