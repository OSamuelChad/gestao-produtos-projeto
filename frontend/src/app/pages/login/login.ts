import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { MessageModule } from '@openng/optimus-ui/message';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, ButtonModule, InputTextModule, MessageModule],
  template: `
    <section class="mx-auto flex min-h-[calc(100vh-132px)] max-w-md items-center">
      <form (submit)="entrar($event)" novalidate class="surface-card w-full overflow-hidden rounded-2xl">
        <div class="border-b border-slate-100 p-8 text-center">
          <div class="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-slate-900 text-lg font-semibold text-white">G</div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-950">Bem-vindo</h1>
          <p class="mt-1 text-sm text-slate-500">Entre para gerenciar seus produtos</p>
        </div>

        <div class="space-y-5 p-6">
          @if (erro(); as msg) {
            <p-message severity="error" [text]="msg" />
          }

          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-sm font-medium text-slate-700">E-mail</label>
            <input id="email" type="email" pInputText class="w-full" autocomplete="username" [formField]="f.email" />
            @if (f.email().touched() && f.email().invalid()) {
              @for (e of f.email().errors(); track e) {
                <small class="text-red-600">{{ e.message }}</small>
              }
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="senha" class="text-sm font-medium text-slate-700">Senha</label>
            <input id="senha" type="password" pInputText class="w-full" autocomplete="current-password" [formField]="f.senha" />
            @if (f.senha().touched() && f.senha().invalid()) {
              @for (e of f.senha().errors(); track e) {
                <small class="text-red-600">{{ e.message }}</small>
              }
            }
          </div>

          <p-button type="submit" label="Entrar" styleClass="w-full" [loading]="f().submitting()" />

          <p class="rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500">
            Usuário de demonstração:<br />
            <strong>admin&#64;exemplo.com</strong> / <strong>123456</strong>
          </p>
        </div>
      </form>
    </section>
  `,
})
export class Login {
  /** Query param ?returnUrl=... (preenchido pelo authGuard) */
  readonly returnUrl = input<string>();

  private auth = inject(AuthService);
  private router = inject(Router);

  protected readonly erro = signal<string | null>(null);
  private readonly model = signal({ email: '', senha: '' });

  protected readonly f = form(this.model, (p) => {
    required(p.email, { message: 'Informe o e-mail.' });
    email(p.email, { message: 'E-mail inválido.' });
    required(p.senha, { message: 'Informe a senha.' });
  });

  entrar(evento: Event) {
    evento.preventDefault();
    this.erro.set(null);
    submit(this.f, async () => {
      try {
        await firstValueFrom(this.auth.login(this.model()));
        await this.router.navigateByUrl(this.returnUrl() || '/produtos');
      } catch (e) {
        const semConexao = e instanceof HttpErrorResponse && e.status === 0;
        this.erro.set(
          semConexao
            ? 'Não foi possível conectar à API. Ela está em execução?'
            : e instanceof HttpErrorResponse && e.error?.mensagem
              ? e.error.mensagem
              : 'Falha ao entrar.',
        );
      }
    });
  }
}
