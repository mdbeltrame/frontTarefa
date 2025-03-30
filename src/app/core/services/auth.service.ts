import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegistroDTO } from '../../static/dtos/registro/registro.dto';
import { LoginDTO } from '../../static/dtos/registro/login.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/usuario';
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(localStorage.getItem('authToken'));

  constructor(private http: HttpClient, private router: Router) {}

  registrar(usuario: RegistroDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  login(usuario: LoginDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, usuario).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token);
          this.tokenSubject.next(token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

}
