import type { Oculos } from './types';
import { oculos } from './data/oculos';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function fetchOculos(): Promise<Oculos[]> {
  return oculos;
}

export async function fetchOculosById(id: string): Promise<Oculos> {
  const item = oculos.find((o) => o.id === Number(id));
  if (!item) throw new Error('Óculos não encontrado');
  return item;
}

export async function cadastrarClube(formData: FormData): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/clube`, {
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
