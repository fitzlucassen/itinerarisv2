import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { MatTabsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatCardModule, MatInputModule, MatMenuModule, MatSelectModule, MatSliderModule, MatSnackBarModule, MatFormFieldModule, MatDatepickerModule } from '@angular/material';

// import { HomeVisitorComponent } from '../../component/visitor/home/home.visitor.component';
// import { UserMapComponent } from '../../component/visitor/user-map/user-map.component';
// import { MapComponent } from '../../component/visitor/map/map.component';
// import { SearchItineraryPipe } from '../../pipe/search-itinerary.pipe';
// import { SearchMapComponent } from '../../component/visitor/search-map/search-map.component';
// import { WorldMapComponent } from '../../component/visitor/world-map/world-map.component';
// import { IInfoWindowComponent } from '../../component/visitor/i-info-window/i-info-window.component';

import { routing } from '../../routing/visitor.routing';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        HttpModule,
        MatTabsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatCardModule, MatInputModule, MatMenuModule, MatSelectModule, MatSliderModule, MatSnackBarModule, MatFormFieldModule, MatDatepickerModule,
        routing
    ],
    declarations: [
        // UserMapComponent,
        // MapComponent,
        // HomeVisitorComponent,
        // SearchMapComponent,
        // WorldMapComponent,
        // IInfoWindowComponent,
        // SearchItineraryPipe
    ],
    entryComponents: [
        // IInfoWindowComponent
    ]
})
export class VisitorModule { }
