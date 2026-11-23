import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <header class="sticky top-0 z-20 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 shadow-lg">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a routerLink="/produtos" class="flex items-center gap-3 text-white">
          <span class="grid size-9 place-items-center rounded-xl bg-white/20 text-lg font-bold backdrop-blur">G</span>
          <span class="text-lg font-semibold tracking-tight">Gestão de Produtos</span>
        </a>

        @if (auth.logado()) {
          <nav class="flex items-center gap-2">
            <a
              routerLink="/produtos"
              routerLinkActive="bg-white/20"
              [routerLinkActiveOptions]="{ exact: true }"
              class="rounded-lg px-3 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              Produtos
            </a>
            <a
              routerLink="/produtos/novo"
              routerLinkActive="bg-white/20"
              class="rounded-lg px-3 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
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
