/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserMapComponent } from './user-map.component';

describe('UserMapComponent', () => {
    let component: UserMapComponent;
    let fixture: ComponentFixture<UserMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserMapComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
