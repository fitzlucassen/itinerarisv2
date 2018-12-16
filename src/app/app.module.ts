import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { MatIconModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { NgsRevealModule } from 'ngx-scrollreveal';
import { ShareButtonsModule } from '@ngx-share/buttons';

import { AuthGuard } from './guard/auth-guard';
import { NoAuthGuard } from './guard/no-auth-guard';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home/home.component';
import { UserService } from './service/user.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharingDialogComponent } from './component/common/sharing-dialog/sharing-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SharingDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,      // (Required) for share counts
    HttpClientJsonpModule, // (Optional) For linkedIn & Tumblr counts
    AppRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgsRevealModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng',
      libraries: ['places']
    }),
    ShareButtonsModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [UserService, AuthGuard, NoAuthGuard],
  entryComponents: [
    SharingDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
