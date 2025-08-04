import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../services/firestore';
import { saveNfcPreference } from '../utils/storage';
import { arrayToBitmask, bitmaskToArray } from '../utils/bitmask';
import { useStore } from '../store';

// Lista de alérgenos. A ordem deve ser igual à de ALLERGEN_NAMES em Profile.js.
const ALLERGEN_NAMES = [
  'Leite',
  'Ovo',
  'Amendoim',
  'Soja',
  'Trigo',
  'Peixes',
  'Frutos do Mar',
  'Castanhas',
  'Milho',
  'Coco',
  'Abacaxi',
  'Morango',
];

export default function EditProfile() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const [nome, setNome] = useState(profile?.nome || '');
  const [idade, setIdade] = useState(profile?.idade ?? '');
  const [selectedBits, setSelectedBits] = useState(
    profile ? bitmaskToArray(profile.bitmask, profile.bitCount || ALLERGEN_NAMES.length) : []
  );
  const [useNfc, setUseNfc] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!profile) {
    navigate('/register');
    return null;
  }

  const toggleAlergeno = (index) => {
    setSelectedBits((prev) => {
      if (prev.includes(index)) {
        return prev.filter((bit) => bit !== index);
      }
      return [...prev, index];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !idade) {
      alert('Preencha nome e idade.');
      return;
    }
    setSaving(true);
    try {
      const bitmask = arrayToBitmask(selectedBits);
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
    <div style={{ padding: '2rem' }}>
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
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
        <div style={{ marginBottom: '1rem' }}>
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
        <div style={{ marginBottom: '1rem' }}>
          <strong>Selecione seus alérgenos:</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {ALLERGEN_NAMES.map((name, idx) => (
              <li key={idx}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedBits.includes(idx)}
                    onChange={() => toggleAlergeno(idx)}
                  />
                  {name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={useNfc}
              onChange={(e) => setUseNfc(e.target.checked)}
            />
            Usar NFC para armazenar o perfil
          </label>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
}

