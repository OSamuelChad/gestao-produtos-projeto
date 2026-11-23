import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Componente presentacional: recebe dados por input() e apenas os exibe. */
@Component({
  selector: 'app-produto-resumo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Produtos</p>
        <p class="mt-1 text-3xl font-bold text-indigo-600">{{ exibidos() }}</p>
        <p class="text-xs text-slate-400">de {{ total() }} cadastrados</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Valor somado</p>
        <p class="mt-1 text-3xl font-bold text-emerald-600">{{ valorTotal() | currency: 'BRL' }}</p>
        <p class="text-xs text-slate-400">considerando os filtros</p>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Categorias</p>
        <p class="mt-1 text-3xl font-bold text-violet-600">{{ categorias() }}</p>
        <p class="text-xs text-slate-400">diferentes</p>
      </div>
    </div>
  `,
})
export class ProdutoResumo {
  readonly total = input.required<number>();
  readonly exibidos = input.required<number>();
  readonly valorTotal = input.required<number>();
  readonly categorias = input.required<number>();
}
