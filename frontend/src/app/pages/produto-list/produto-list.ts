import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MessageModule } from '@openng/optimus-ui/message';
import { ProdutoFiltro } from '../../components/produto-filtro';
import { ProdutoResumo } from '../../components/produto-resumo';
import { ProdutoTabela } from '../../components/produto-tabela';
import { Produto } from '../../models/produto';
import { ProdutoStateService } from '../../services/produto-state.service';

/** Página (container): liga os componentes filhos ao service de estado. */
@Component({
  selector: 'app-produto-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonModule, MessageModule, ProdutoFiltro, ProdutoResumo, ProdutoTabela],
  template: `
    <section class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Produtos</h1>
          <p class="text-sm text-slate-500">Liste, consulte, edite e remova os produtos cadastrados.</p>
        </div>
        <p-button label="Novo produto" routerLink="/produtos/novo" styleClass="!rounded-xl shadow" />
      </div>

      <app-produto-resumo
        [total]="state.produtos().length"
        [exibidos]="state.filtrados().length"
        [valorTotal]="state.valorTotal()"
        [categorias]="state.categorias().length"
      />

      <app-produto-filtro
        [(busca)]="state.busca"
        [(categoria)]="state.categoria"
        [categorias]="state.categorias()"
        (limpar)="state.limparFiltros()"
      />

      @if (state.erro(); as erro) {
        <p-message severity="error" [text]="erro" />
      }

      @if (state.carregando()) {
        <p class="py-10 text-center text-slate-500">Carregando…</p>
      } @else {
        <app-produto-tabela
          [produtos]="state.filtrados()"
          (ver)="ver($event)"
          (editar)="editar($event)"
          (remover)="confirmarRemocao($event)"
        />
      }
    </section>
  `,
})
export class ProdutoList implements OnInit {
  protected readonly state = inject(ProdutoStateService);
  private router = inject(Router);
  private confirmation = inject(ConfirmationService);
  private toast = inject(MessageService);

  ngOnInit() {
    this.state.carregar();
  }

  ver(p: Produto) {
    this.router.navigate(['/produtos', p.id]);
  }

  editar(p: Produto) {
    this.router.navigate(['/produtos', p.id, 'editar']);
  }

  confirmarRemocao(p: Produto) {
    this.confirmation.confirm({
      header: 'Remover produto',
      message: `Deseja realmente remover "${p.nome}"?`,
      acceptLabel: 'Remover',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () =>
        this.state.remover(p.id).subscribe({
          next: () => this.toast.add({ severity: 'success', summary: 'Removido', detail: `"${p.nome}" foi removido.` }),
          error: () => this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível remover o produto.' }),
        }),
    });
  }
}
