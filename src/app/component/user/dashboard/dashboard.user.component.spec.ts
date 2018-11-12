/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DashboardUserComponent } from './dashboard.user.component';

describe('DashboardComponent', () => {
    let component: DashboardUserComponent;
    let fixture: ComponentFixture<DashboardUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardUserComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
