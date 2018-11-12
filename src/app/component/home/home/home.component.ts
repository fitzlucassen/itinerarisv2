import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private router: Router, private metaService: Meta, private titleService: Title) {
        this.titleService.setTitle('Vos itinéraires de voyages - Itineraris');
        this.metaService.updateTag({ content: 'Vos itinéraires de voyages - Itineraris' }, 'property="og:title"');
        this.metaService.updateTag({ content: 'Créez simplement vos itinéraires de voyages et tenez informé vos proches en temps réel, inspirez-vous des itinéraires d\'autres voyageurs, il est temps de voyager !' }, 'name="description"');
        this.metaService.updateTag({ content: 'Créez simplement vos itinéraires de voyages et tenez informé vos proches en temps réel, inspirez-vous des itinéraires d\'autres voyageurs, il est temps de voyager !' }, 'property="og:description"');
    }

    ngOnInit() {
    }
}
