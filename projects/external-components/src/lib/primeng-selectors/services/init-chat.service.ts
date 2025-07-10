import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class InitChatService {

  constructor(private http: HttpClient) {}
  initializeChat() {
    return this.http.get('/rest/init-chat');
  }
}
