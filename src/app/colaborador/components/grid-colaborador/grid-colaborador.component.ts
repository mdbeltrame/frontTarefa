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
import { ChangeDetectorRef } from '@angular/core';
import { ColaboradorService } from '../../../core/services/colaborador.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalConfirmacaoComponent } from '../../../modal-confirmacao/components/modal-confirmacao.component';
import { ColaboradorDTO } from '../../../static/dtos/registro/colaborador.dto';
import { StringConstants } from '../../../static/constants/string.constants';
import * as bootstrap from 'bootstrap';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-grid-colaborador',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ModalConfirmacaoComponent,
    NzButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid-colaborador.component.html',
  styleUrl: './grid-colaborador.component.css',
})
export class GridColaboradorComponent {
  private router = inject(Router);
  private colaboradorService = inject(ColaboradorService);
  private authService = inject(AuthService);
  readonly colaboradores = signal<Array<ColaboradorDTO>>([]);
  readonly exibirModal = signal(false);
  private colaboradorParaExcluir!: number | null;

  readonly LISTA_DE_COLABORADORES = StringConstants.TITULOS.LISTA_DE_COLABORADORES;
  readonly NOVO = StringConstants.TITULOS.NOVO;
  readonly NOME = StringConstants.TITULOS.NOME;
  readonly LOGOUT = StringConstants.TITULOS.LOGOUT;
  readonly ACOES = StringConstants.TITULOS.ACOES;
  readonly EDITAR = StringConstants.TITULOS.EDITAR;
  readonly EXCLUIR = StringConstants.TITULOS.EXCLUIR;
  readonly COLABORADOR = StringConstants.TITULOS.COLABORADOR;
  readonly NENHUM_COLABORADOR_CADASTRADO = StringConstants.TITULOS.NENHUM_COLABORADOR_CADASTRADO;
  readonly VOLTAR_PARA_DASHBOARD = StringConstants.TITULOS.VOLTAR_PARA_DASHBOARD;

  ngOnInit(): void {
    console.log('GridColaboradorComponent - ngOnInit - Início.');
    this.onBusca();

  }

  onBusca(): void {
    console.log('GridColaboradorComponent - onBusca - Buscando colaboradores.');

    this.colaboradorService
      .buscar()
      .pipe(
        tap((response) => {
          console.log(
            'GridColaboradorComponent - onBusca - Colaboradores carregados com sucesso.',
            response
          );
          this.colaboradores.set(response);
        }),
        catchError((error) => {
          console.error(
            'GridColaboradorComponent - onBusca - Erro ao buscar colaboradores.',
            error
          );
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  onEditarColaborador(colaborador: ColaboradorDTO): void {
    console.log(
      `GridColaboradorComponent - onEditarColaborador - Editando Colaborador: ${colaborador.codigo}`
    );
    this.router.navigate(['/colaborador/', colaborador.codigo]);
  }

  onExcluirColaborador(codigo: number): void {
    console.log(
      `GridColaboradorComponent - onExcluirColaborador - Iniciando Exclusão de Colaborador: ${codigo}`
    );
    this.colaboradorParaExcluir = codigo;
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
    if (this.colaboradorParaExcluir !== null) {
      console.log(
        `GridColaboradorComponent - onConfirmarExclusao - Confirmando exclusão do colaborador ${this.colaboradorParaExcluir}`
      );

      this.colaboradorService
        .excluirColaborador(this.colaboradorParaExcluir)
        .pipe(
          tap(() => {
            console.log(
              `GridColaboradorComponent - onConfirmarExclusao - Colaborador ${this.colaboradorParaExcluir} excluído com sucesso.`
            );
            this.onBusca();
            this.exibirModal.set(false);
          }),
          catchError((error) => {
            console.error(
              `GridColaboradorComponent - onConfirmarExclusao - Erro ao excluir colaborador ${this.colaboradorParaExcluir}.`,
              error
            );
            return throwError(() => error);
          })
        )
        .subscribe();
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
    this.router.navigate(['/colaborador/cadastro']);
  }

}
