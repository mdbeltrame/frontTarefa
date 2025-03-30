import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
import { TarefaService } from '../../core/services/tarefa.service';
import { AuthService } from '../../core/services/auth.service';
import { ModalConfirmacaoComponent } from '../../modal-confirmacao/components/modal-confirmacao.component';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule, ModalConfirmacaoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private tarefaService = inject(TarefaService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  public tarefas: any[] = [];
  public exibirModal = false;
  private tarefaParaExcluir!: number | null;

  ngOnInit(): void {
    console.log('DashboardComponent - ngOnInit - Início.');
    this.onBusca();

  }

   onBusca(): void {
    console.log('DashboardComponent - onBusca - Buscando tarefas.');

      this.dashboardService
        .buscar()
        .pipe(
          tap((response) => {
            console.log(
              'DashboardComponent - onBusca - Tarefas carregadas com sucesso.',
              response
            );
            this.tarefas = response;
            this.cdr.detectChanges();
          }),
          catchError((error) => {
            console.error(
              'DashboardComponent - onBusca - Erro ao buscar tarefas.',
              error
            );
            return throwError(() => error);
          })
        )
        .subscribe();
    }

    onNovaTarefa(): void {
      console.log('DashboardComponent - onNovaTarefa - Redirecionando para criação de nova tarefa.');
      this.router.navigate(['/tarefa']);
    }

    onEditarTarefa(tarefa: any): void {
      console.log(`DashboardComponent - onEditarTarefa - Editando tarefa: ${tarefa.codigo}`);
      this.router.navigate(['/tarefa/', tarefa.codigo]);
    }
  
    onExcluirTarefa(codigo: number): void {
      console.log(`DashboardComponent - onExcluirTarefa - Iniciando Exclusão da Tarefa: ${codigo}`);
      this.tarefaParaExcluir = codigo;
      this.exibirModal = true;
    }

    onConfirmarExclusao(): void {
      if (this.tarefaParaExcluir !== null) {
        console.log(`DashboardComponent - onConfirmarExclusao - Confirmando exclusão da tarefa ${this.tarefaParaExcluir}`);
    
        this.tarefaService
          .excluirTarefa(this.tarefaParaExcluir)
          .pipe(
            tap(() => {
              console.log(`DashboardComponent - onConfirmarExclusao - Tarefa ${this.tarefaParaExcluir} excluída com sucesso.`);
              this.onBusca();
              this.exibirModal = false;
            }),
            catchError((error) => {
              console.error(`DashboardComponent - onConfirmarExclusao - Erro ao excluir tarefa ${this.tarefaParaExcluir}.`, error);
              return throwError(() => error);
            })
          )
          .subscribe();
      }
    }

    //Formata o texto pois no campo salvo tudo maiusculo e junto
    formatStatus(status: string): string {
      switch (status) {
        case 'ABERTO':
          return 'Aberto';
        case 'EMANDAMENTO':
          return 'Em andamento';
        case 'CONCLUIDA':
          return 'Concluída';
        default:
          return status;
      }
    }

    //Troca a cor do status
    getStatusClass(status: string): string {
      switch (status) {
        case 'ABERTO':
          return 'status-aberto';
        case 'EMANDAMENTO':
          return 'status-andamento';
        case 'CONCLUIDA':
          return 'status-concluida';
        default:
          return '';
      }
    }

    onLogout() {
      this.authService.logout();
      this.router.navigate(['/login']);
    }

}
