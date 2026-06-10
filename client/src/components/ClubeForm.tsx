import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { cadastrarClube, formatarCPF } from '../api';

export default function ClubeForm() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  function handleCpfChange(e: ChangeEvent<HTMLInputElement>) {
    setCpf(formatarCPF(e.target.value));
  }

  function handleArquivoChange(e: ChangeEvent<HTMLInputElement>) {
    setArquivo(e.target.files?.[0] ?? null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);

    if (!arquivo) {
      setMensagem({ tipo: 'erro', texto: 'Selecione o cupom fiscal.' });
      return;
    }

    const formData = new FormData();
    formData.append('nome_completo', nome);
    formData.append('cpf', cpf);
    formData.append('data_nascimento', dataNascimento);
    formData.append('cupom_fiscal', arquivo);

    setLoading(true);
    try {
      const result = await cadastrarClube(formData);
      setMensagem({ tipo: 'sucesso', texto: result.message });
      setNome('');
      setCpf('');
      setDataNascimento('');
      setArquivo(null);
      const input = document.getElementById('cupom_fiscal') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err) {
      setMensagem({
        tipo: 'erro',
        texto: err instanceof Error ? err.message : 'Erro ao cadastrar.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="clube" className="section clube">
      <div className="container">
        <div className="clube-grid">
          <div className="clube-info">
            <h2 className="section-title">Clube de Benefícios</h2>
            <p className="section-subtitle">
              Cadastre-se e aproveite descontos exclusivos, promoções antecipadas e muito mais!
            </p>
            <ul className="clube-beneficios">
              <li>Descontos especiais em toda a loja</li>
              <li>Acesso antecipado a promoções</li>
              <li>Brindes e sorteios exclusivos</li>
              <li>Manutenção gratuita do seu óculos</li>
            </ul>
          </div>

          <form className="clube-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <input
                id="data_nascimento"
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cupom_fiscal">Cupom Fiscal</label>
              <div className="file-input-wrapper">
                <input
                  id="cupom_fiscal"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleArquivoChange}
                  required
                />
                <span className="file-hint">
                  {arquivo ? arquivo.name : 'PDF, JPG ou PNG (máx. 5MB)'}
                </span>
              </div>
            </div>

            {mensagem && (
              <div className={`alert alert-${mensagem.tipo}`}>{mensagem.texto}</div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar no Clube'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
