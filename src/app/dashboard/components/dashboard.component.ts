import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { TarefaService } from '../../core/services/tarefa.service';
import { AuthService } from '../../core/services/auth.service';
import { ModalConfirmacaoComponent } from '../../modal-confirmacao/components/modal-confirmacao.component';
import { TarefaDTO } from '../../static/dtos/registro/tarefa.dto';
import { StringConstants } from '../../static/constants/string.constants';
import * as bootstrap from 'bootstrap';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ModalConfirmacaoComponent,
    NzButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private tarefaService = inject(TarefaService);
  private authService = inject(AuthService);
  readonly tarefas = signal<Array<TarefaDTO>>([]);
  readonly exibirModal = signal(false);
  private tarefaParaExcluir!: number | null;
  public horaAtual : string = '';

  readonly LISTA_DE_TAREFAS = StringConstants.TITULOS.LISTA_DE_TAREFAS;
  readonly NOVO = StringConstants.TITULOS.NOVO;
  readonly LOGOUT = StringConstants.TITULOS.LOGOUT;
  readonly TITULO = StringConstants.TITULOS.TITULO;
  readonly DESCRICAO = StringConstants.TITULOS.DESCRICAO;
  readonly STATUS = StringConstants.TITULOS.STATUS;
  readonly DATA_DE_CRIACAO = StringConstants.TITULOS.DATA_DE_CRIACAO;
  readonly ACOES = StringConstants.TITULOS.ACOES;
  readonly EDITAR = StringConstants.TITULOS.EDITAR;
  readonly EXCLUIR = StringConstants.TITULOS.EXCLUIR;
  readonly NENHUMA_TAREFA_CADASTRADA = StringConstants.TITULOS.NENHUMA_TAREFA_CADASTRADA;
  readonly COLABORADOR = StringConstants.TITULOS.COLABORADOR;

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
          this.tarefas.set(response);
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
    console.log(
      'DashboardComponent - onNovaTarefa - Redirecionando para criação de nova tarefa.'
    );
    this.router.navigate(['/tarefa']);
  }

  onEditarTarefa(tarefa: any): void {
    console.log(
      `DashboardComponent - onEditarTarefa - Editando tarefa: ${tarefa.codigo}`
    );
    this.router.navigate(['/tarefa/', tarefa.codigo]);
  }

  onExcluirTarefa(codigo: number): void {
    console.log(
      `DashboardComponent - onExcluirTarefa - Iniciando Exclusão da Tarefa: ${codigo}`
    );
    this.tarefaParaExcluir = codigo;
    this.exibirModal.set(true);
    setTimeout(() => {
      this.OnShowModal();
    }, 0);
  }

  OnShowModal(): void {
    const modalElement = document.getElementById('modalConfirmacao');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Elemento do modal não encontrado no DOM.');
    }
  }

  onConfirmarExclusao(): void {
    if (this.tarefaParaExcluir !== null) {
      console.log(
        `DashboardComponent - onConfirmarExclusao - Confirmando exclusão da tarefa ${this.tarefaParaExcluir}`
      );

      this.tarefaService
        .excluirTarefa(this.tarefaParaExcluir)
        .pipe(
          tap(() => {
            console.log(
              `DashboardComponent - onConfirmarExclusao - Tarefa ${this.tarefaParaExcluir} excluída com sucesso.`
            );
            this.onBusca();
            this.exibirModal.set(false);
          }),
          catchError((error) => {
            console.error(
              `DashboardComponent - onConfirmarExclusao - Erro ao excluir tarefa ${this.tarefaParaExcluir}.`,
              error
            );
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
        return 'text-warning';
      case 'EMANDAMENTO':
        return 'text-info';
      case 'CONCLUIDA':
        return 'text-success';
      default:
        return '';
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cancelar(): void {
    this.exibirModal.set(false);
  }

  onNovoColaborador(): void {
    console.log(
      'DashboardComponent - onNovoColaborador - Redirecionando para criação de novo colaborador.'
    );
    this.router.navigate(['/colaborador']);
  }
}
