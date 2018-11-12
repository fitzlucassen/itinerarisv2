import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Currency } from '../model/currency';

@Pipe({
  name: 'SearchCurrencyPipe'
})
@Injectable()
export class SearchCurrencyPipe implements PipeTransform {

    transform(value: Array<Currency>, args?: string): Array<Currency> {
        if (!args) {
            return value;
        }
        return value.filter(v => v.code.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) >= 0 || v.description.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) >= 0);
    }
}
