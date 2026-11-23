import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';

/**
 * Componente de filtro. Usa model() para comunicação em duas vias com o pai:
 *   <app-produto-filtro [(busca)]="state.busca" [(categoria)]="state.categoria" />
 * e output() para avisar o pai de um evento (limpar).
 */
@Component({
  selector: 'app-produto-filtro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputTextModule, ButtonModule],
  template: `
    <div class="surface-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
      <input
        pInputText
        type="search"
        class="w-full sm:flex-1"
        placeholder="Buscar por nome ou descrição…"
        [value]="busca()"
        (input)="busca.set($any($event.target).value)"
      />

      <select
        class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:w-56"
        [value]="categoria() ?? ''"
        (change)="categoria.set($any($event.target).value || null)"
      >
        <option value="">Todas as categorias</option>
        @for (c of categorias(); track c) {
          <option [value]="c" [selected]="c === categoria()">{{ c }}</option>
        }
      </select>

      <p-button label="Limpar" severity="secondary" [outlined]="true" (onClick)="limpar.emit()" />
    </div>
  `,
})
export class ProdutoFiltro {
  readonly busca = model('');
  readonly categoria = model<string | null>(null);
  readonly categorias = input<string[]>([]);
  readonly limpar = output<void>();
}
