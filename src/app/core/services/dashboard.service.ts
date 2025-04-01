import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TarefaDTO } from '../../static/dtos/registro/tarefa.dto';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/tarefa';

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  buscar(): Observable<Array<TarefaDTO>> {
    const token = localStorage.getItem('authToken');
    console.log('Token JWT: ', token);

    if (!token) {
      throw new Error('Token JWT não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log(headers);

    return this.http.get<Array<TarefaDTO>>(`${this.apiUrl}`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.log('Sessão expirada, redirecionando para login...');
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
