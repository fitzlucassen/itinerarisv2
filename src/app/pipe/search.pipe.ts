import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Itinerary } from '../model/itinerary';

@Pipe({
    name: 'SearchPipe'
})
@Injectable()
export class SearchPipe implements PipeTransform {

    transform(value: Array<Itinerary>, args?: string): Array<Itinerary> {
        if (!args) {
            return value;
        }
        return value.filter(v => v.name.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) !== -1 || v.country.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) !== -1);
    }
}
