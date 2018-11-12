import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/user';

@Pipe({
    name: 'SearchUserPipe'
})
export class SearchUserPipe implements PipeTransform {
    transform(value: Array<User>, args?: string): Array<User> {
        if (!args) {
            return value;
        }
        return value.filter(v =>
            v.name.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) !== -1 ||
            v.email.toLocaleLowerCase().indexOf(args.toLocaleLowerCase()) !== -1);
    }
}
