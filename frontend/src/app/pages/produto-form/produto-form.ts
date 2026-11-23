import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormField, form, min, minLength, required, submit, validate } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { firstValueFrom } from 'rxjs';
import { CATEGORIAS_SUGERIDAS, ProdutoInput } from '../../models/produto';
import { ProdutoStateService } from '../../services/produto-state.service';

/**
 * Tela de cadastro E edição (mesmo componente, duas rotas):
 *   /produtos/novo        -> sem :id  => cadastro
 *   /produtos/:id/editar  -> com :id  => edição
 * O formulário é um Signal Form: o model é um signal e cada campo é ligado com [formField].
 */
@Component({
  selector: 'app-produto-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink, ButtonModule, InputTextModule, TextareaModule],
  template: `
    <section class="mx-auto max-w-2xl space-y-6">
      <a routerLink="/produtos" class="text-sm font-medium text-indigo-600 hover:underline">← Voltar para a lista</a>

      <form (submit)="salvar($event)" novalidate class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div class="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <h1 class="text-2xl font-bold">{{ id() ? 'Editar produto' : 'Novo produto' }}</h1>
          <p class="text-sm text-white/80">Preencha os dados abaixo. Campos com * são obrigatórios.</p>
        </div>

        <div class="space-y-5 p-6">
          <div class="flex flex-col gap-1.5">
            <label for="nome" class="text-sm font-medium text-slate-700">Nome *</label>
            <input id="nome" pInputText class="w-full" [formField]="f.nome" />
            @if (f.nome().touched() && f.nome().invalid()) {
              @for (e of f.nome().errors(); track e) {
                <small class="text-red-600">{{ e.message }}</small>
              }
            }
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="descricao" class="text-sm font-medium text-slate-700">Descrição *</label>
            <textarea id="descricao" pTextarea rows="4" class="w-full" [formField]="f.descricao"></textarea>
            @if (f.descricao().touched() && f.descricao().invalid()) {
              @for (e of f.descricao().errors(); track e) {
                <small class="text-red-600">{{ e.message }}</small>
              }
            }
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label for="preco" class="text-sm font-medium text-slate-700">Preço (R$) *</label>
              <input id="preco" type="number" step="0.01" pInputText class="w-full" [formField]="f.preco" />
              @if (f.preco().touched() && f.preco().invalid()) {
                @for (e of f.preco().errors(); track e) {
                  <small class="text-red-600">{{ e.message }}</small>
                }
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="categoria" class="text-sm font-medium text-slate-700">Categoria *</label>
              <input id="categoria" list="categorias" pInputText class="w-full" [formField]="f.categoria" />
              <datalist id="categorias">
                @for (c of categorias; track c) {
                  <option [value]="c"></option>
                }
              </datalist>
              @if (f.categoria().touched() && f.categoria().invalid()) {
                @for (e of f.categoria().errors(); track e) {
                  <small class="text-red-600">{{ e.message }}</small>
                }
              }
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
          <p-button label="Cancelar" severity="secondary" [outlined]="true" routerLink="/produtos" />
          <p-button
            type="submit"
            [label]="id() ? 'Salvar alterações' : 'Cadastrar'"
            [loading]="f().submitting()"
          />
        </div>
      </form>
    </section>
  `,
})
export class ProdutoForm implements OnInit {
  /** Vem da rota (withComponentInputBinding); undefined no cadastro. */
  readonly id = input<string>();

  private state = inject(ProdutoStateService);
  private router = inject(Router);
  private toast = inject(MessageService);

  protected readonly categorias = CATEGORIAS_SUGERIDAS;

  // Model do formulário: um signal com o objeto editado
  private readonly model = signal<ProdutoInput>({ nome: '', descricao: '', preco: 0, categoria: '' });

  // Signal Form + regras de validação
  protected readonly f = form(this.model, (p) => {
    required(p.nome, { message: 'Informe o nome.' });
    minLength(p.nome, 3, { message: 'O nome deve ter ao menos 3 caracteres.' });
    required(p.descricao, { message: 'Informe a descrição.' });
    required(p.categoria, { message: 'Informe a categoria.' });
    validate(p.preco, ({ value }) =>
      Number.isFinite(value()) ? undefined : { kind: 'preco', message: 'Informe um preço válido.' },
    );
    min(p.preco, 0, { message: 'O preço não pode ser negativo.' });
  });

  ngOnInit() {
    const id = this.id();
    if (!id) return;
    // Edição: carrega o produto e preenche o model (os campos atualizam automaticamente)
    this.state.obter(Number(id)).subscribe({
      next: ({ nome, descricao, preco, categoria }) => this.model.set({ nome, descricao, preco, categoria }),
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Produto não encontrado.' });
        this.router.navigate(['/produtos']);
      },
    });
  }

  salvar(evento: Event) {
    evento.preventDefault();
    // submit() marca os campos como "touched" e só executa a ação se o formulário for válido
    submit(this.f, async () => {
      const dados = this.model();
      const id = this.id();
      try {
        await firstValueFrom(id ? this.state.atualizar(Number(id), dados) : this.state.criar(dados));
        this.toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: id ? 'Produto atualizado.' : 'Produto cadastrado.',
        });
        this.router.navigate(['/produtos']);
      } catch {
        this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar o produto.' });
      }
    });
  }
}
