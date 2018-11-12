import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../component/home/home/home.component';

const routes: Routes = [
  { path: 'visiteur', loadChildren: '../module/visitor/visitor.module#VisitorModule' },
  { path: 'compte', loadChildren: '../module/membership/membership.module#MembershipModule' },
  {
      path: '',
      component: HomeComponent,
      data: {
          meta: {
              title: 'Vos itinéraires voyages - Itineraris',
              description: 'Créez vos itinéraires de voyages et tenez informé vos proches'
          }
      }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
