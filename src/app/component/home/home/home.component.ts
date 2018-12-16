import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private isWebpEnabledSource = new Subject<boolean>();

    constructor(private router: Router, private metaService: Meta, private titleService: Title) {
        this.titleService.setTitle('Vos itinéraires de voyages - Itineraris');
        this.metaService.updateTag({ content: 'Vos itinéraires de voyages - Itineraris' }, 'property="og:title"');
        this.metaService.updateTag({ content: 'Créez simplement vos itinéraires de voyages et tenez informé vos proches en temps réel, inspirez-vous des itinéraires d\'autres voyageurs, il est temps de voyager !' }, 'name="description"');
        this.metaService.updateTag({ content: 'Créez simplement vos itinéraires de voyages et tenez informé vos proches en temps réel, inspirez-vous des itinéraires d\'autres voyageurs, il est temps de voyager !' }, 'property="og:description"');
    }

    ngOnInit() {
    }

    isWebpEnabledAnnounced$ = this.isWebpEnabledSource.asObservable();

    isWebpEnabled() {
        let webpImage = new Image();

        webpImage.src = 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';

        webpImage.onload = () => {
            if (webpImage.width === 2 && webpImage.height === 1) {
                this.isWebpEnabledSource.next(true);
            } else {
                this.isWebpEnabledSource.next(false);
            }
        }
    }
}
