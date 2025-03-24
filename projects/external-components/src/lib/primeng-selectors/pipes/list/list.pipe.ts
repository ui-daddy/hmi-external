import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'list'})
export class ListPipe implements PipeTransform {
  transform(arr: Array<any>, fieldName: string): Array<any> {
    arr = this.uniqArr(arr, fieldName);
    return arr.filter(value => value !== null && value !== undefined).map((v)=> {
        return ({label: v , value: v });
    });
  }

  private uniqArr(arr: Array<any>,fieldName:string): Array<any> {
    return arr.reduce((prev,curr)=>{
       if(prev.indexOf(curr[fieldName]) === -1) {
          prev.push(curr[fieldName]);
       }
       return prev;
    },[])
  }
}