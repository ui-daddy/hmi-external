import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicString'
})
export class DynamicStringPipe implements PipeTransform {

  transform(value: any, args: Array<any>): any {
    let result = value;
    if (value && args && args.length) {
      for (let index = 0, length = args.length; index < length; index++) {
        result = result.replace('{' + index + '}', args[index]);
      }
    }
    return result;
  }

}
