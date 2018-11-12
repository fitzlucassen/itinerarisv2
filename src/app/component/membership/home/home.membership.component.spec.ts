/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeMembershipComponent } from './home.membership.component';

describe('UserComponent', () => {
    let component: HomeMembershipComponent;
    let fixture: ComponentFixture<HomeMembershipComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeMembershipComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeMembershipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
