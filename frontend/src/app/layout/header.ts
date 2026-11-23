import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 text-slate-900 backdrop-blur">
      <div class="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4">
        <a routerLink="/produtos" class="flex min-w-0 items-center gap-3 text-slate-900 no-underline">
          <span class="grid size-9 shrink-0 place-items-center rounded-[10px] bg-slate-900 text-sm font-semibold text-white">G</span>
          <span class="truncate text-base font-semibold tracking-tight sm:text-lg">Gestão de Produtos</span>
        </a>

        @if (auth.logado()) {
          <nav class="flex items-center gap-2">
            <a
              routerLink="/produtos"
              routerLinkActive="bg-white/20"
              [routerLinkActiveOptions]="{ exact: true }"
              class="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
            >
              Produtos
            </a>
            <a
              routerLink="/produtos/novo"
              routerLinkActive="bg-white/20"
              class="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
            >
              Novo
            </a>
            <span class="mx-2 hidden h-6 w-px bg-white/30 sm:block"></span>
            <span class="hidden text-sm text-white/80 sm:block">{{ auth.usuario()?.nome }}</span>
            <p-button label="Sair" size="small" severity="contrast" [outlined]="true" styleClass="!border-white/60 !text-white hover:!bg-white/10" (onClick)="auth.logout()" />
          </nav>
        }
      </div>
    </header>
  `,
})
export class Header {
  protected readonly auth = inject(AuthService);
}
