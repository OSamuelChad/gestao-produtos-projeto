import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Protege as rotas do frontend: sem token válido, redireciona para /login. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.logado() || router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Evita que um usuário já logado volte para a tela de login. */
export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return !auth.logado() || router.createUrlTree(['/produtos']);
};
