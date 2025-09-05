import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  score: number;
  durationInDays: number;
  bugsCount: number;
  madeDadeline: boolean; 
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  // private apiUrl = 'https://private-052d6-testapi4528.apiary-mock.com/info';
  // private apiUrl = 'https://localhost:7035/api/projects';
  private apiUrl = 'https://localhost:7035/info';


  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap(res =>
         console.log('Projects: ', res))
    );
  }
}
