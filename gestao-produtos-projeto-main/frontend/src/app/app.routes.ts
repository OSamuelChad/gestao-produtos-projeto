import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar',
    canActivate: [loginGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'produtos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'Produtos',
        loadComponent: () => import('./pages/produto-list/produto-list').then((m) => m.ProdutoList),
      },
      {
        path: 'novo',
        title: 'Novo produto',
        loadComponent: () => import('./pages/produto-form/produto-form').then((m) => m.ProdutoForm),
      },
      {
        path: ':id/editar',
        title: 'Editar produto',
        loadComponent: () => import('./pages/produto-form/produto-form').then((m) => m.ProdutoForm),
      },
      {
        path: ':id',
        title: 'Detalhes do produto',
        loadComponent: () => import('./pages/produto-detail/produto-detail').then((m) => m.ProdutoDetail),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'produtos' },
  { path: '**', redirectTo: 'produtos' },
];
