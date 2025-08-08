import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../services/firestore';
import { saveNfcPreference } from '../utils/storage';
import { arrayToBitmask, bitmaskToArray } from '../utils/bitmask';
import { useStore } from '../store';
import { GLUTEN_SOURCES } from '../constants/allergens';
import PageLayout from './PageLayout';

// Lista de fontes de glúten importada de src/constants/allergens.js. A ordem deve ser mantida.

export default function EditProfile() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const [nome, setNome] = useState(profile?.nome || '');
  const [idade, setIdade] = useState(profile?.idade ?? '');
  const [selectedBits, setSelectedBits] = useState(
    profile ? bitmaskToArray(profile.bitmask, profile.bitCount || GLUTEN_SOURCES.length) : []
  );
  const [hasCeliac, setHasCeliac] = useState(false);
  const [useNfc, setUseNfc] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!profile) {
    navigate('/register');
    return null;
  }

  // Ajusta a lista de fontes de glúten automaticamente ao marcar "Tenho doença celíaca"
  useEffect(() => {
    if (hasCeliac) {
      setSelectedBits([...Array(GLUTEN_SOURCES.length).keys()]); // seleciona todos
    } else if (selectedBits.length === GLUTEN_SOURCES.length) {
      setSelectedBits([]); // desmarca todos
    }
  }, [hasCeliac]);

  const toggleFonte = (index) => {
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
        bitCount: GLUTEN_SOURCES.length,
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
              Tenho doença celíaca (seleciona automaticamente todas as fontes de glúten)
            </label>
          </div>

          <div className="form-group">
            <strong>Selecione as fontes de glúten:</strong>
            <ul className="list-unstyled">
              {GLUTEN_SOURCES.map((name, idx) => (
                <li key={idx}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedBits.includes(idx)}
                      onChange={() => toggleFonte(idx)}
                    />
                    {name}
                  </label>
                </li>
              ))}
            </ul>
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
