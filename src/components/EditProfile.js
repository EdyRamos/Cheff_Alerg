import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../services/firestore';
import { saveNfcPreference } from '../utils/storage';
import { arrayToBitmask } from '../utils/bitmask';
import { useStore } from '../store';
import PageLayout from './PageLayout';

export default function EditProfile() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const [nome, setNome] = useState(profile?.nome || '');
  const [idade, setIdade] = useState(profile?.idade ?? '');
  const [hasCeliac, setHasCeliac] = useState((profile.bitmask & 1) !== 0);
  const [useNfc, setUseNfc] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!profile) {
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !idade) {
      alert('Preencha nome e idade.');
      return;
    }
    setSaving(true);
    try {
      const bitmask = arrayToBitmask(hasCeliac ? [0] : []);
      const updated = {
        ...profile,
        nome: nome.trim(),
        idade: Number(idade),
        bitmask,
      };
      await saveProfile(updated, { nfc: useNfc });
      saveNfcPreference(useNfc);
      setProfile(updated);
      navigate('/profile');
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
        <h1>Editar Perfil</h1>
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
