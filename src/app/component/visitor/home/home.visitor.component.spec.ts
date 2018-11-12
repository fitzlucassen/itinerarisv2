/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeVisitorComponent } from './home.visitor.component';

describe('HomeComponent', () => {
    let component: HomeVisitorComponent;
    let fixture: ComponentFixture<HomeVisitorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeVisitorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeVisitorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
