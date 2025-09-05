import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of, throwError } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  
  private apiUrl = 'MOCK';
  //private apiUrl = this.sharedService.apiUrl;

  private tokenKey = 'jwt';
  private personalKey = 'personalDetails';

  constructor(private http: HttpClient, private sharedService : SharedService) {}

 login(email: string, password: string): Observable<LoginResponse> {
  if (this.apiUrl === 'MOCK') {
    if (!email || !password) {
      return throwError(() => new Error('Email and Password are mandatory'));
    }

    const mockExample: LoginResponse = {
      token: '1111-2222-3333-4444',
      personalDetails: {
        name: 'Test Test',
        Team: 'Developers',
        joinedAt: '2018-10-01',
        avatar: 'https://avatarfiles.alphacoders.com/164/thumb-164632.jpg',
      },
    };

   return of(mockExample).pipe( // of so it will act as observable
  delay(3000),  // delay for 3 secs to test spinner showing up
  map(res => {
    this.saveToken(res.token);
    this.savePersonalDetails(res.personalDetails);
    return res;
  })
);
  }

  // Default (for when you connect to real API later)
  return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
    map(res => {
      this.saveToken(res.token);
      this.savePersonalDetails(res.personalDetails);
      return res;
    })
  );
}



  // --- token/personal details storage (localStorage), so refresh keeps session
  saveToken(token: string) { 
    localStorage.setItem(this.tokenKey, token); 
  }

  getToken(): string | null { 
    return localStorage.getItem(this.tokenKey); 
  }

  savePersonalDetails(p: LoginResponse['personalDetails']) {
    localStorage.setItem(this.personalKey, JSON.stringify(p));
  }

  getPersonalDetails(): LoginResponse['personalDetails'] | null {
    const raw = localStorage.getItem(this.personalKey);
    return raw ? JSON.parse(raw) : null;
  }

  logout() {
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