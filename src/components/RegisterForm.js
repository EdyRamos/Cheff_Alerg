import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../services/firestore';
import { saveNfcPreference } from '../utils/storage';
import { arrayToBitmask } from '../utils/bitmask';
import { ALLERGEN_NAMES } from '../constants/allergens';

// Lista de alérgenos importada de src/constants/allergens.js. A ordem deve ser mantida.

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
  const [selectedBits, setSelectedBits] = useState([]);
  const [useNfc, setUseNfc] = useState(false);
  const [saving, setSaving] = useState(false);

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
      const uid = generateUid();
      const bitmask = arrayToBitmask(selectedBits);
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
    <div style={{ padding: '2rem' }}>
      <h1>Cadastro</h1>
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
