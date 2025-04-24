import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ColaboradorDTO } from '../../static/dtos/registro/colaborador.dto';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  private apiUrl = 'http://localhost:8080/colaborador';

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  buscar(): Observable<Array<ColaboradorDTO>> {
    const token = localStorage.getItem('authToken');
    console.log('Token JWT: ', token);

    if (!token) {
      throw new Error('Token JWT não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log(headers);

    return this.http.get<Array<ColaboradorDTO>>(`${this.apiUrl}`, { headers }).pipe(
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

  registrar(tarefa: ColaboradorDTO): Observable<any> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token JWT não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/registrar`, tarefa, { headers });
  }

  excluirColaborador(codigo: number): Observable<void> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token JWT não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<void>(`${this.apiUrl}/${codigo}`, { headers });
  }

   buscarPorCodigo(codigo: number): Observable<ColaboradorDTO> {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        throw new Error('Token JWT não encontrado');
      }
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.get<ColaboradorDTO>(`${this.apiUrl}/${codigo}`, { headers });
    }

}