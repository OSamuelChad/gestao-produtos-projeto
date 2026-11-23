import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Produto, ProdutoInput } from '../models/produto';

/** Comunicação com a API REST via HttpClient. */
@Injectable({ providedIn: 'root' })
export class ProdutoApiService {
  private http = inject(HttpClient);
  private readonly url = '/api/produtos';

  listar() {
    return this.http.get<Produto[]>(this.url);
  }

  obter(id: number) {
    return this.http.get<Produto>(`${this.url}/${id}`);
  }

  criar(produto: ProdutoInput) {
    return this.http.post<Produto>(this.url, produto);
  }

  atualizar(id: number, produto: ProdutoInput) {
    return this.http.put<Produto>(`${this.url}/${id}`, produto);
  }

  remover(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
