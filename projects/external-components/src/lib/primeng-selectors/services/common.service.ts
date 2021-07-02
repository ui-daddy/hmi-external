import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) {}

    getData(url: string, payload?: any) {
        return this.http.get(url)
                    .toPromise()
                    .then(data => { return data; });
    }
}
