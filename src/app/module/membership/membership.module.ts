import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatGridListModule, MatAutocompleteModule, MatSlideToggleModule, MatProgressSpinnerModule, MatNativeDateModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatCardModule, MatInputModule, MatMenuModule, MatSelectModule, MatSliderModule, MatSnackBarModule, MatFormFieldModule, MatDatepickerModule } from '@angular/material';

import { NgsRevealModule } from 'ngx-scrollreveal';

import { HomeMembershipComponent } from '../../component/membership/home/home.membership.component';
import { SignUpDialogComponent } from '../../component/membership/signup-dialog/signup-dialog.membership.component';
import { DashboardUserComponent } from '../../component/user/dashboard/dashboard.user.component';
import { ItineraryDialogComponent } from '../../component/user/itinerary-dialog/itinerary-dialog.component';
import { StepDialogComponent } from '../../component/user/step-dialog/step-dialog.component';
import { StopDialogComponent } from '../../component/user/stop-dialog/stop-dialog.component';
import { UploadFileComponent } from '../../component/common/upload-file/upload-file.component';
import { ItineraryUserComponent } from '../../component/user/itinerary/itinerary.user.component';
import { ItineraryUserDialogComponent } from '../../component/user/itinerary-user-dialog/itinerary-user-dialog.component';
import { StepDetailDialogComponent } from '../../component/user/step-detail-dialog/step-detail-dialog.component';

import { SearchPipe } from '../../pipe/search.pipe';
import { SearchStepPipe } from '../../pipe/search-step.pipe';
import { SearchUserPipe } from '../../pipe/search-user.pipe';
import { SearchCurrencyPipe } from '../../pipe/search-currency.pipe';

import { routing } from '../../routing/membership.routing';

@NgModule({
    declarations: [
        HomeMembershipComponent,
        SignUpDialogComponent,
        DashboardUserComponent,
        ItineraryUserComponent,
        ItineraryDialogComponent,
        ItineraryUserDialogComponent,
        StepDialogComponent,
        StopDialogComponent,
        UploadFileComponent,
        StepDetailDialogComponent,
        SearchPipe,
        SearchStepPipe,
        SearchUserPipe,
        SearchCurrencyPipe
    ],
    entryComponents: [
        ItineraryDialogComponent,
        StepDialogComponent,
        StopDialogComponent,
        ItineraryUserDialogComponent,
        StepDetailDialogComponent,
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        HttpModule,
        NgsRevealModule,
        MatGridListModule, MatAutocompleteModule, MatSlideToggleModule, MatProgressSpinnerModule, MatNativeDateModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatCardModule, MatInputModule, MatMenuModule, MatSelectModule, MatSliderModule, MatSnackBarModule, MatFormFieldModule, MatDatepickerModule,
        routing
    ]
})
export class MembershipModule { }
