import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { NgsRevealModule } from 'ngx-scrollreveal';

import { AuthGuard } from './guard/auth-guard';
import { NoAuthGuard } from './guard/no-auth-guard';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home/home.component';
import { UserService } from './service/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
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
    NgsRevealModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng',
      libraries: ['places']
    })
  ],
  providers: [UserService, AuthGuard, NoAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
