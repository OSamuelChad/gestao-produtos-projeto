import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MessageModule } from '@openng/optimus-ui/message';
import { TagModule } from '@openng/optimus-ui/tag';
import { Produto } from '../../models/produto';

/** Detalhe do produto: usa httpResource (reativo ao parâmetro :id da rota, que chega como input). */
@Component({
  selector: 'app-produto-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, ButtonModule, MessageModule, TagModule],
  template: `
    <section class="mx-auto max-w-2xl space-y-6">
      <a routerLink="/produtos" class="text-sm font-medium text-indigo-600 hover:underline">← Voltar para a lista</a>

      @if (produto.isLoading()) {
        <p class="py-10 text-center text-slate-500">Carregando…</p>
      } @else if (produto.error()) {
        <p-message severity="error" text="Produto não encontrado ou erro ao consultar a API." />
      } @else if (produto.hasValue()) {
        @let p = produto.value();
        <article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div class="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <p class="text-xs uppercase tracking-widest text-white/70">Produto #{{ p.id }}</p>
            <h1 class="mt-1 text-2xl font-bold">{{ p.nome }}</h1>
          </div>
          <dl class="grid gap-6 p-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Descrição</dt>
              <dd class="mt-1 text-slate-700">{{ p.descricao }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</dt>
              <dd class="mt-1"><p-tag [value]="p.categoria" severity="info" styleClass="!rounded-full" /></dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Preço</dt>
              <dd class="mt-1 text-2xl font-bold text-emerald-600">{{ p.preco | currency: 'BRL' }}</dd>
            </div>
          </dl>
          <div class="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
            <p-button label="Voltar" severity="secondary" [outlined]="true" routerLink="/produtos" />
            <p-button label="Editar" [routerLink]="['/produtos', p.id, 'editar']" />
          </div>
        </article>
      }
    </section>
  `,
})
export class ProdutoDetail {
  readonly id = input.required<string>();
  protected readonly produto = httpResource<Produto>(() => `/api/produtos/${this.id()}`);
}
