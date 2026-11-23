import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 text-slate-900 backdrop-blur-md">
      <div class="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4">
        <a routerLink="/produtos" class="flex min-w-0 items-center gap-3 text-slate-900 no-underline">
          <span class="grid size-9 shrink-0 place-items-center rounded-[10px] bg-indigo-600 text-sm font-semibold text-white shadow-sm">G</span>
          <span class="truncate text-base font-semibold tracking-tight sm:text-lg">Gestão de Produtos</span>
        </a>

        @if (auth.logado()) {
          <nav class="flex items-center gap-1 sm:gap-2">
            <a
              routerLink="/produtos"
              routerLinkActive="!bg-indigo-50 !text-indigo-700"
              [routerLinkActiveOptions]="{ exact: true }"
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-900"
            >
              Produtos
            </a>
            <a
              routerLink="/produtos/novo"
              routerLinkActive="!bg-indigo-50 !text-indigo-700"
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-900"
            >
              Novo
            </a>
            <span class="mx-2 hidden h-6 w-px bg-slate-200 sm:block"></span>
            <span class="hidden items-center gap-2 sm:flex">
              <span class="grid size-8 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">{{ iniciais() }}</span>
              <span class="text-sm font-medium text-slate-700">{{ auth.usuario()?.nome }}</span>
            </span>
            <p-button label="Sair" size="small" severity="secondary" [outlined]="true" (onClick)="auth.logout()" />
          </nav>
        }
      </div>
    </header>
  `,
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly iniciais = computed(() =>
    (this.auth.usuario()?.nome ?? '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join(''),
  );
}
