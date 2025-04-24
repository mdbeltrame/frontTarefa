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
import { ColaboradorService } from '../../../core/services/colaborador.service';
import { ColaboradorDTO } from '../../../static/dtos/registro/colaborador.dto';
import { StringConstants } from '../../../static/constants/string.constants';

@Component({
  selector: 'app-cadastro-colaborador',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cadastro-colaborador.component.html',
  styleUrl: './cadastro-colaborador.component.css',
})
export class CadastroColaboradorComponent {
  private router = inject(Router);
  private colaboradorService = inject(ColaboradorService);
  private formBuilder = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);

  readonly form = this.formBuilder.group({
    codigo: this.formBuilder.control<number | null>(null),
    nome: this.formBuilder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ])
    )
  });

  readonly COLABORADOR = StringConstants.TITULOS.COLABORADOR;
  readonly NOME = StringConstants.TITULOS.NOME;
  readonly VOLTAR = StringConstants.TITULOS.VOLTAR;
  readonly SALVAR = StringConstants.TITULOS.SALVAR;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const codigo = Number(params.get('codigo'));
      if (codigo) {
        this.onCarregarColaborador(codigo);
      }
    });
  }

  onRegistrar(): void {
    console.log('CadastroColaboradorComponent - onRegistrar - Inicio.');

    this.colaboradorService
      .registrar(
        new ColaboradorDTO(
          this.form.value.codigo!,
          this.form.value.nome!,
        )
      )
      .pipe(
        tap((response) => {
          console.log(
            'CadastroColaboradorComponent - onRegistrar - Colaborador Cadastrado Com Sucesso.',
            response
          );
          this.router.navigate(['/colaborador']);
        }),
        catchError((error) => {
          console.error(
            'CadastroColaboradorComponent - onRegistrar - Erro ao Cadastrar Colaborador.',
            error
          );
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  private onCarregarColaborador(codigo: number): void {
    console.log(`CadastroColaboradorComponent - onCarregarColaborador - Código: ${codigo}`);

    this.colaboradorService
      .buscarPorCodigo(codigo)
      .pipe(
        tap((colaborador) => {
          console.log(
            'CadastroColaboradorComponent - onCarregarColaborador - Colaborador carregado:',
            colaborador
          );
          this.form.patchValue(colaborador);
        }),
        catchError((error) => {
          console.error(
            'CadastroColaboradorComponent - onCarregarColaborador - Erro ao buscar colaborador:',
            error
          );
          return throwError(() => error);
        })
      )
      .subscribe();
  }
}
