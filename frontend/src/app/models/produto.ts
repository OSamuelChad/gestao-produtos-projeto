export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
}

export type ProdutoInput = Omit<Produto, 'id'>;

export const CATEGORIAS_SUGERIDAS = ['Informática', 'Periféricos', 'Móveis', 'Eletrodomésticos', 'Outros'];
