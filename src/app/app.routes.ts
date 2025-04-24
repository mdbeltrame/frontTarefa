import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { DashboardComponent } from './dashboard/components/dashboard.component';
import { TarefaComponent } from './tarefa/components/tarefa.component';
import { GridColaboradorComponent } from './colaborador/components/grid-colaborador/grid-colaborador.component';
import { CadastroColaboradorComponent } from './colaborador/components/cadastro-colaborador/cadastro-colaborador.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard]},
    { path: 'tarefa', component: TarefaComponent, canActivate: [AuthGuard]},
    { path: 'tarefa/:codigo', component: TarefaComponent, canActivate: [AuthGuard]},
    { path: 'colaborador', component: GridColaboradorComponent, canActivate: [AuthGuard]},
    { path: 'colaborador/cadastro', component: CadastroColaboradorComponent, canActivate: [AuthGuard]},
    { path: 'colaborador/:codigo', component: CadastroColaboradorComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
  ];
