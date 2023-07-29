export const AppendText = (value:any)=> {
    console.info('external ',value);
    return value.map((v:any)=> ({...v, description: 'kiran'}));
}