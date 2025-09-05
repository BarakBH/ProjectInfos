import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  apiUrl: string = window.location.href.includes("localhost") ? 'https://localhost:44378' : 'https://prodapi/api/auth/login'; // i like to use this method so in development and in the server the client will know the right url
}
