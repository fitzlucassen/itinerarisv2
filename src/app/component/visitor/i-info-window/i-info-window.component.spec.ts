import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IInfoWindowComponent } from './i-info-window.component';

describe('IInfoWindowComponent', () => {
    let component: IInfoWindowComponent;
    let fixture: ComponentFixture<IInfoWindowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IInfoWindowComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IInfoWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
