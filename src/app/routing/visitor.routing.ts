import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { HomeVisitorComponent } from '../component/visitor/home/home.visitor.component';
// import { UserMapComponent } from '../component/visitor/user-map/user-map.component';
// import { WorldMapComponent } from '../component/visitor/world-map/world-map.component';

const appRoutes: Routes = [
    // {
    //     path: 'itineraires.html',
    //     component: HomeVisitorComponent,
    //     data: {
    //         meta: {
    //             title: 'Trouvez un itinéraire de voyage',
    //             description: 'Recherchez un itinéraire de voyage'
    //         }
    //     }
    // },
    // {
    //     path: 'world/:iduser/:nameuser',
    //     component: WorldMapComponent,
    //     data: {
    //         meta: {
    //             title: 'Les voyages',
    //             description: 'Visualisation des itinéraires de voyage'
    //         }
    //     }
    // },
    // {
    //     path: ':nameuser/:id/:name',
    //     component: UserMapComponent,
    //     data: {
    //         meta: {
    //             title: 'Itinéraire de voyage',
    //             description: 'Visualisation de l\'itinéraire de voyage'
    //         }
    //     }
    // }
];

export const routing: ModuleWithProviders = RouterModule.forChild(appRoutes);
