import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of, throwError, tap } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class AuthService {


  // private apiUrl = 'https://private-052d6-testapi4528.apiary-mock.com/authenticate';
  // private apiUrl = this.sharedService.apiUrl;
  private apiUrl = 'https://localhost:7035/authenticate';

  private tokenKey = 'jwt';
  private personalKey = 'personalDetails';

  constructor(private http: HttpClient, private sharedService: SharedService) { }


    login(email: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse[]>(this.apiUrl, { email, password }).pipe(
    map(resArray => resArray[0]), // get first object from array
    tap(res => {
      // console.log('Login response is: ', res);
      this.saveToken(res.token);
      this.savePersonalDetails(res.personalDetails);
    })
  );
}


  // token/personal details storage (localStorage), so refresh keeps session - saving state
  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  savePersonalDetails(details: any) {
  if (!details) {
    localStorage.removeItem('personalDetails');
    return;
  }
  localStorage.setItem('personalDetails', JSON.stringify(details));
}

  getPersonalDetails() {
  const raw = localStorage.getItem('personalDetails');
  if (!raw) return null; // nothing stored yet
  try {
    return JSON.parse(raw);
  } catch {
    // the value in storage is corrupted (e.g., "undefined")
    localStorage.removeItem('personalDetails');
    return null;
  }
}


  logout() {// cleaning local storage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.personalKey);
  }

}


export interface LoginResponse {
  token: string;
  personalDetails: {
    name: string;
    Team: string;
    joinedAt: string;
    avatar: string;
  };
}