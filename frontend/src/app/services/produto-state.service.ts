import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Produto, ProdutoInput } from '../models/produto';
import { ProdutoApiService } from './produto-api.service';

/** Armazena o estado do frontend (lista, filtros, loading, erro) usando signals. */
@Injectable({ providedIn: 'root' })
export class ProdutoStateService {
  private api = inject(ProdutoApiService);

  private readonly _produtos = signal<Produto[]>([]);
  readonly produtos = this._produtos.asReadonly();
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  // filtros (alterados pelos componentes filhos através de signals)
  readonly busca = signal('');
  readonly categoria = signal<string | null>(null);

  readonly categorias = computed(() => [...new Set(this._produtos().map((p) => p.categoria))].sort());

  readonly filtrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const cat = this.categoria();
    return this._produtos().filter(
      (p) =>
        (!cat || p.categoria === cat) &&
        (!termo || p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo)),
    );
  });

  readonly valorTotal = computed(() => this.filtrados().reduce((soma, p) => soma + p.preco, 0));

  carregar() {
    this.carregando.set(true);
    this.erro.set(null);
    this.api.listar().subscribe({
      next: (lista) => {
        this._produtos.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os produtos. Verifique se a API está em execução.');
        this.carregando.set(false);
      },
    });
  }

  obter(id: number) {
    return this.api.obter(id);
  }

  criar(dados: ProdutoInput) {
    return this.api.criar(dados).pipe(tap((novo) => this._produtos.update((lista) => [...lista, novo])));
  }

  atualizar(id: number, dados: ProdutoInput) {
    return this.api
      .atualizar(id, dados)
      .pipe(tap((atual) => this._produtos.update((lista) => lista.map((p) => (p.id === id ? atual : p)))));
  }

  remover(id: number) {
    return this.api.remover(id).pipe(tap(() => this._produtos.update((lista) => lista.filter((p) => p.id !== id))));
  }

  limparFiltros() {
    this.busca.set('');
    this.categoria.set(null);
  }
}
