import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StringConstants } from '../../../static/constants/string.constants';
import { LoginDTO } from '../../../static/dtos/registro/login.dto';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly mensagemError = signal('');

  readonly form = this.formBuilder.group({
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

  readonly ENTRAR = StringConstants.TITULOS.ENTRAR;

  onSubmit(): void {
    console.log('LoginComponent - OnSubmit - Inicio.');
    
    this.authService
      .login(new LoginDTO(this.form.value.email!, this.form.value.senha!))
      .pipe(
        tap((response) => {
          console.log(
            'LoginComponent - OnSubmit - Login realizado com sucesso.',
            response
          );

          localStorage.setItem('authToken', response.token);
          
          this.mensagemError.set('');
          this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          console.error('LoginComponent - OnSubmit - Erro ao logar.', error);
          this.mensagemError.set(error.error.message);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  alterou(): void{
    if(!this.mensagemError()){
      return;
    }
    this.mensagemError.set('');
  }

}
