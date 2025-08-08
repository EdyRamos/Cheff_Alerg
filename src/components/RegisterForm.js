import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../services/firestore';
import { saveNfcPreference } from '../utils/storage';
import { arrayToBitmask } from '../utils/bitmask';
import PageLayout from './PageLayout';

// Gera um UID simples combinando timestamp e número aleatório.
const generateUid = () => {
  return (
    'id-' +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [hasCeliac, setHasCeliac] = useState(false);
  const [useNfc, setUseNfc] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !idade) {
      alert('Preencha nome e idade.');
      return;
    }
    setSaving(true);
    try {
      const uid = generateUid();
      const bitmask = arrayToBitmask(hasCeliac ? [0] : []);
      const profile = {
        uid,
        nome: nome.trim(),
        idade: Number(idade),
        bitmask,
      };
      await saveProfile(profile, { nfc: useNfc });
      saveNfcPreference(useNfc);
      navigate('/modes');
    } catch (err) {
      console.error('Erro ao salvar perfil', err);
      alert('Falha ao salvar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-content">
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Nome:
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Idade:
              <input
                type="number"
                min="0"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={hasCeliac}
                onChange={(e) => setHasCeliac(e.target.checked)}
              />
              Tenho doença celíaca (intolerância a glúten)
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={useNfc}
                onChange={(e) => setUseNfc(e.target.checked)}
              />
              Usar NFC para armazenar o perfil
            </label>
          </div>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar Perfil'}
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
