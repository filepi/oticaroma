export interface Oculos {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  preco_original: number | null;
  descricao: string;
  descricao_detalhada: string;
  imagem: string;
  cor: string;
  material: string;
  tipo: string;
}

export interface ClubeFormData {
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  cupom_fiscal: File;
}
