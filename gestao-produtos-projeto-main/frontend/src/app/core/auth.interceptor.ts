import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/** Anexa o JWT em toda chamada à API e faz logout automático quando a API responde 401. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const ehApi = req.url.startsWith('/api');
  const ehLogin = req.url.startsWith('/api/auth/login');

  const requisicao = ehApi && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(requisicao).pipe(
    catchError((erro: unknown) => {
      if (erro instanceof HttpErrorResponse && erro.status === 401 && ehApi && !ehLogin) {
        auth.logout();
      }
      return throwError(() => erro);
    }),
  );
};
