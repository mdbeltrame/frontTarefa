import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { RegistroDTO } from '../../../static/dtos/registro/registro.dto';
import { StringConstants } from '../../../static/constants/string.constants';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly form = this.formBuilder.group({
    nome: this.formBuilder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ])
    ),
    email: this.formBuilder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50),
      ])
    ),
    senha: this.formBuilder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
      ])
    ),
  });

  readonly NOME = StringConstants.TITULOS.NOME;
  readonly SENHA = StringConstants.TITULOS.SENHA;
  readonly EMAIL = StringConstants.TITULOS.EMAIL;
  readonly CADASTRE_SE = StringConstants.TITULOS.CADASTRE_SE;
  readonly CADASTRAR = StringConstants.TITULOS.CADASTRAR;
  readonly FACA_LOGIN = StringConstants.TITULOS.FACA_LOGIN;
  readonly JA_TEM_CONTA = StringConstants.PERGUNTAS.JA_TEM_UMA_CONTA;

  onSubmit(): void {
    console.log('RegisterComponent - OnSubmit - Inicio.');

    this.authService
      .registrar(
        new RegistroDTO(
          this.form.value.nome!,
          this.form.value.email!,
          this.form.value.senha!
        )
      )
      .pipe(
        tap((response) => {
          console.log(
            'RegisterComponent - OnSubmit - Usuário cadastrado com sucesso.',
            response
          );

          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          console.error(
            'RegisterComponent - OnSubmit - Erro ao cadastrar.',
            error
          );

          return throwError(() => error);
        })
      )
      .subscribe();
  }
}
