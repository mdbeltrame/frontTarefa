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
import { ColaboradorService } from '../../core/services/colaborador.service';
import { ColaboradorDTO } from '../../static/dtos/registro/colaborador.dto';
import { StringConstants } from '../../static/constants/string.constants';
import { GridColaboradorComponent } from "../components/grid-colaborador/grid-colaborador.component";

@Component({
  selector: 'app-colaborador-page',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule, GridColaboradorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-grid-colaborador></app-grid-colaborador>`,
})
export class ColaboradorPageComponent {
  
}
