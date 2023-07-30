import { DatePipe } from "@angular/common";

export const dateTransform = (value:any)=> {
    const datePipe = new DatePipe('en-US');
    const dateFormat = 'dd/MM/YYYY';
    return value.map((v:any)=> {
        const expectedStartDate = datePipe.transform(v.expectedStartDate, dateFormat);
        const expectedEndDate = datePipe.transform(v.expectedEndDate, dateFormat);
        return { ...v, expectedStartDate, expectedEndDate };
    });
}
