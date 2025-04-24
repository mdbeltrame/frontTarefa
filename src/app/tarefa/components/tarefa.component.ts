import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { TarefaService } from '../../core/services/tarefa.service';
import { TarefaDTO } from '../../static/dtos/registro/tarefa.dto';
import { StringConstants } from '../../static/constants/string.constants';
import { ColaboradorDTO } from '../../static/dtos/registro/colaborador.dto';
import { ColaboradorService } from '../../core/services/colaborador.service';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-tarefa',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tarefa.component.html',
  styleUrl: './tarefa.component.css',
})
export class TarefaComponent {
  private router = inject(Router);
  private tarefaService = inject(TarefaService);
  private formBuilder = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private colaboradorService = inject(ColaboradorService);
  readonly colaboradores = signal<ColaboradorDTO[]>([]);

  readonly form = this.formBuilder.group({
    codigo: this.formBuilder.control<number | null>(null),
    titulo: this.formBuilder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ])
    ),
    descricao: this.formBuilder.control(
      '',
      Validators.compose([Validators.minLength(10), Validators.maxLength(300)])
    ),
    status: this.formBuilder.control(
      'ABERTO',
      Validators.compose([Validators.required])
    ),
    dataCriacao: this.formBuilder.control<Date | null>(null),
    colaborador: this.formBuilder.control<ColaboradorDTO | null>(
      null,
      Validators.compose([Validators.required])
    ),
  });

  readonly NOVA_TAREFA = StringConstants.TITULOS.NOVA_TAREFA;
  readonly TITULO = StringConstants.TITULOS.TITULO;
  readonly DESCRICAO = StringConstants.TITULOS.DESCRICAO;
  readonly STATUS = StringConstants.TITULOS.STATUS;
  readonly ABERTO = StringConstants.TITULOS.ABERTO;
  readonly EM_ANDAMENTO = StringConstants.TITULOS.EM_ANDAMENTO;
  readonly CONCLUIDA = StringConstants.TITULOS.CONCLUIDA;
  readonly VOLTAR_PARA_DASHBOARD =
    StringConstants.TITULOS.VOLTAR_PARA_DASHBOARD;
  readonly SALVAR = StringConstants.TITULOS.SALVAR;
  readonly COLABORADOR = StringConstants.TITULOS.COLABORADOR;

  constructor() {
    this.onCarregarColaboradores();

    this.route.paramMap.subscribe((params) => {
      const codigo = Number(params.get('codigo'));
      if (codigo) {
        this.onCarregarTarefa(codigo);
      }
    });
  }

  private onCarregarTarefa(codigo: number): void {
    console.log(`TarefaComponent - onCarregarTarefa - Código: ${codigo}`);

    this.tarefaService
      .buscarPorCodigo(codigo)
      .pipe(
        tap((tarefa) => {
          console.log(
            'TarefaComponent - onCarregarTarefa - Tarefa carregada:',
            tarefa
          );

          //Confere se o colaborador vindo da tarefa existe na lista de colaboradores
          const colaboradorSelecionado = this.colaboradores().find(
            (colab) => colab.codigo === tarefa.colaborador.codigo
          );

          //Monta o form
          this.form.patchValue({
            codigo: tarefa.codigo,
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            status: tarefa.status,
            dataCriacao: tarefa.dataCriacao,
            colaborador: colaboradorSelecionado ?? null,
          });
        }),
        catchError((error) => {
          console.error(
            'TarefaComponent - onCarregarTarefa - Erro ao buscar tarefa:',
            error
          );
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  private onCarregarColaboradores(): void {
    this.colaboradorService
      .buscar()
      .pipe(
        tap((res) => {
          console.log(
            'TarefaComponent - onCarregarColaboradores - Colaboradores carregados:',
            res
          );
          this.colaboradores.set(res ?? []);
        }),
        catchError((error) => {
          console.error(
            'TarefaComponent - onCarregarColaboradores - Erro ao buscar colaboradores:',
            error
          );
          this.colaboradores.set([]);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  onRegistrar(): void {
    console.log('TarefaComponent - onRegistrar - Inicio.');

    this.tarefaService
      .registrar(
        new TarefaDTO(
          this.form.value.codigo!,
          this.form.value.titulo!,
          this.form.value.descricao!,
          this.form.value.status!,
          this.form.value.dataCriacao!,
          this.form.value.colaborador!
        )
      )
      .pipe(
        tap((response) => {
          console.log(
            'TarefaComponent - onRegistrar - Tarefa Cadastrada Com Sucesso.',
            response
          );
          this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          console.error(
            'TarefaComponent - onRegistrar - Erro ao Cadastrar Tarefa.',
            error
          );
          return throwError(() => error);
        })
      )
      .subscribe();
  }
}
