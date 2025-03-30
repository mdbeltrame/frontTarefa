import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TarefaDTO } from '../../static/dtos/registro/tarefa.dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private apiUrl = 'http://localhost:8080/tarefa';

  constructor(private http: HttpClient) {}
  
  registrar(tarefa: TarefaDTO): Observable<any> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token JWT não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/registrar`, tarefa, { headers });
  }

  buscarPorCodigo(codigo: number): Observable<TarefaDTO> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token JWT não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<TarefaDTO>(`${this.apiUrl}/${codigo}`, { headers });
  }

  excluirTarefa(codigo: number): Observable<void> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token JWT não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<void>(`${this.apiUrl}/${codigo}`, { headers });
  }
}