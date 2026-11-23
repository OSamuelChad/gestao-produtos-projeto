import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'usuario';

function tokenExpirado(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

/** Guarda o JWT e o usuário logado em signals (estado de autenticação do frontend). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly token = signal<string | null>(this.lerToken());
  readonly usuario = signal<Usuario | null>(this.lerUsuario());
  readonly logado = computed(() => !tokenExpirado(this.token()));

  login(credenciais: { email: string; senha: string }) {
    return this.http.post<LoginResponse>('/api/auth/login', credenciais).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.usuario));
        this.token.set(res.token);
        this.usuario.set(res.usuario);
      }),
    );
  }

  logout(redirecionar = true) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.usuario.set(null);
    if (redirecionar) this.router.navigate(['/login']);
  }

  private lerToken(): string | null {
    const t = localStorage.getItem(TOKEN_KEY);
    return tokenExpirado(t) ? null : t;
  }

  private lerUsuario(): Usuario | null {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
