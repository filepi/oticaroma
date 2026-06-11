import type { Oculos } from './types';
import { oculos as oculosEstaticos } from './data/oculos';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export async function fetchOculos(): Promise<Oculos[]> {
  try {
    return await apiFetch<Oculos[]>('/api/oculos');
  } catch {
    return oculosEstaticos;
  }
}

export async function fetchOculosById(id: string): Promise<Oculos> {
  try {
    return await apiFetch<Oculos>(`/api/oculos/${id}`);
  } catch {
    const item = oculosEstaticos.find((o) => o.id === Number(id));
    if (!item) throw new Error('Óculos não encontrado');
    return item;
  }
}

export async function adminLogin(usuario: string, senha: string): Promise<{ token: string }> {
  return apiFetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha }),
  });
}

export async function adminLogout(token: string): Promise<void> {
  await apiFetch('/api/admin/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminCadastrarOculos(formData: FormData, token: string): Promise<Oculos> {
  return apiFetch('/api/admin/oculos', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

export async function adminAtualizarOculos(
  id: number,
  formData: FormData,
  token: string
): Promise<Oculos> {
  return apiFetch(`/api/admin/oculos/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

export async function adminExcluirOculos(id: number, token: string): Promise<void> {
  await apiFetch(`/api/admin/oculos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
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
