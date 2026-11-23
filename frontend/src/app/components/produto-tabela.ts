import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { TagModule } from '@openng/optimus-ui/tag';
import { Produto } from '../models/produto';

/** Tabela presentacional: dados entram por input(), ações saem por output(). */
@Component({
  selector: 'app-produto-tabela',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, TableModule, ButtonModule, TagModule],
  template: `
    <div class="table-shell surface-card overflow-hidden rounded-2xl">
      <p-table [value]="produtos()" [paginator]="produtos().length > 8" [rows]="8" [rowHover]="true" styleClass="text-sm">
        <ng-template #header>
          <tr>
            <th class="w-16">ID</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th class="text-right">Preço</th>
            <th class="w-64 text-right">Ações</th>
          </tr>
        </ng-template>
        <ng-template #body let-p>
          <tr>
            <td class="text-slate-400">#{{ p.id }}</td>
            <td>
              <p class="font-semibold text-slate-800">{{ p.nome }}</p>
              <p class="line-clamp-1 max-w-md text-xs text-slate-500">{{ p.descricao }}</p>
            </td>
            <td><p-tag [value]="p.categoria" severity="info" styleClass="!rounded-full" /></td>
            <td class="text-right font-medium tabular-nums">{{ p.preco | currency: 'BRL' }}</td>
            <td class="text-right">
              <div class="flex justify-end gap-1">
                <p-button label="Ver" size="small" severity="secondary" [text]="true" (onClick)="ver.emit(p)" />
                <p-button label="Editar" size="small" [text]="true" (onClick)="editar.emit(p)" />
                <p-button label="Excluir" size="small" severity="danger" [text]="true" (onClick)="remover.emit(p)" />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="5" class="py-10 text-center text-slate-500">Nenhum produto encontrado.</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class ProdutoTabela {
  readonly produtos = input.required<Produto[]>();
  readonly ver = output<Produto>();
  readonly editar = output<Produto>();
  readonly remover = output<Produto>();
}
