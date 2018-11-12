import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ItineraryStep } from '../model/itinerary-step';

@Pipe({
    name: 'SearchStepPipe'
})
@Injectable()
export class SearchStepPipe implements PipeTransform {

    transform(value: Array<ItineraryStep>, args?: string): Array<ItineraryStep> {
        if (!args || !value) {
            return value;
        }
        return value.filter(v => v.city.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) !== -1);
    }
}
