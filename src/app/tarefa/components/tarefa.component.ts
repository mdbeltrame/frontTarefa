import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
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

@Component({
  selector: 'app-tarefa',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tarefa.component.html',
  styleUrl: './tarefa.component.css',
})
export class TarefaComponent {
  private router = inject(Router);
  private tarefaService = inject(TarefaService);
  private formBuilder = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);

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
      Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(300),
      ])
    ),
    status: this.formBuilder.control(
      'ABERTO',
      Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
      ])
    ),
    dataCriacao: this.formBuilder.control<Date | null>(null),
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const codigo = Number(params.get('codigo'));
      if (codigo) {
        this.onCarregarTarefa(codigo);
      }
    });
  }

  private onCarregarTarefa(codigo: number): void {
    console.log(`TarefaComponent - onCarregarTarefa - Código: ${codigo}`);

    this.tarefaService.buscarPorCodigo(codigo).pipe(
      tap((tarefa) => {
        console.log('TarefaComponent - onCarregarTarefa - Tarefa carregada:', tarefa);
        this.form.patchValue(tarefa);
      }),
      catchError((error) => {
        console.error('TarefaComponent - onCarregarTarefa - Erro ao buscar tarefa:', error);
        return throwError(() => error);
      })
    ).subscribe();
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
          this.form.value.dataCriacao!
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
