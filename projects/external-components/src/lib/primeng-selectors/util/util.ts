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

export const multiDateTransform = (value:any)=> {
    const datePipe = new DatePipe('en-US');
    const dateFormat = 'dd/MM/YYYY';
    return value.map((v:any)=> {
        const scheduledDate = datePipe.transform(v.scheduledDate, dateFormat);
        const expectedEndDate = datePipe.transform(v.expectedEndDate, dateFormat);
        const actualStartDate = datePipe.transform(v.actualStartDate, dateFormat);
        const actualEndDate = datePipe.transform(v.actualEndDate, dateFormat);
        return { ...v, scheduledDate, expectedEndDate, actualStartDate, actualEndDate };
    });
}

export const multiDateTimeTransform = (value: any) => {
    const datePipe = new DatePipe('en-US');
    const dateTimeFormat = 'dd MMM yy, hh:mm a'; // e.g., 25 Jul 24, 03:45 PM
    return value.map((v: any) => {
        const scheduledDate = datePipe.transform(v.scheduledDate, dateTimeFormat);
        const expectedEndDate = datePipe.transform(v.expectedEndDate, dateTimeFormat);
        const actualStartDate = datePipe.transform(v.actualStartDate, dateTimeFormat);
        const actualEndDate = datePipe.transform(v.actualEndDate, dateTimeFormat);
        return { ...v, scheduledDate, expectedEndDate, actualStartDate, actualEndDate };
    });
}

export const deepClone = (originalObject: any) => {
    return JSON.parse(JSON.stringify(originalObject));
}

export const dropDownOptionTransform = (options:any[]) => {
    return options.map(option =>({ label:option, value:option }))
}