import type { Oculos } from './types';

export async function fetchOculos(): Promise<Oculos[]> {
  const res = await fetch('/api/oculos');
  if (!res.ok) throw new Error('Erro ao carregar ofertas');
  return res.json();
}

export async function fetchOculosById(id: string): Promise<Oculos> {
  const res = await fetch(`/api/oculos/${id}`);
  if (!res.ok) throw new Error('Óculos não encontrado');
  return res.json();
}

export async function cadastrarClube(formData: FormData): Promise<{ message: string }> {
  const res = await fetch('/api/clube', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');
  return data;
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarCPF(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
