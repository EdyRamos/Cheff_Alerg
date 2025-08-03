import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile, loadProfile } from '../services/firestore';

// Define the names of the allergens used in the bitmask.
const ALLERGENS = [
  { name: 'Leite', bit: 0 },
  { name: 'Ovo', bit: 1 },
  { name: 'Amendoim', bit: 2 },
  { name: 'Soja', bit: 3 },
  { name: 'Trigo', bit: 4 },
  { name: 'Peixes', bit: 5 },
  { name: 'Frutos do Mar', bit: 6 },
  { name: 'Castanhas', bit: 7 },
  { name: 'Milho', bit: 8 }
];

/**
 * Registration screen.
 *
 * Allows the player to enter their name and age and select which
 * allergens they need to avoid.  The selected allergens are stored
 * in a bitmask.  Upon submission the profile is persisted to
 * Firebase (via the firestore service) and to local storage.
 */
export default function Register() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bitmask, setBitmask] = useState(0);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  // Load an existing profile from remote storage when the component mounts.
  useEffect(() => {
    async function init() {
      const existing = await loadProfile();
      if (existing) {
        setUid(existing.uid || null);
        setName(existing.nome || '');
        setAge(existing.idade || '');
        setBitmask(existing.bitmask || 0);
      }
    }
    init();
  }, []);

  // Toggle the bit corresponding to an allergen when the checkbox changes.
  const handleToggle = (bit) => {
    setBitmask((prev) => (prev ^ (1 << bit)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Compose the profile object.
    const profile = {
      uid: uid || Date.now().toString(),
      nome: name,
      idade: age,
      bitmask,
      bitCount: ALLERGENS.length
    };
    try {
      await saveProfile(profile);
      navigate('/modes');
    } catch (err) {
      console.error('Failed to save profile', err);
      alert('Falha ao salvar o perfil. Por favor, tente novamente.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Chef Alerg: Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Idade:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min={1}
            />
          </label>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <strong>Selecione seus alérgenos:</strong>
          {ALLERGENS.map(({ name, bit }) => (
            <div key={bit}>
              <label>
                <input
                  type="checkbox"
                  checked={(bitmask & (1 << bit)) !== 0}
                  onChange={() => handleToggle(bit)}
                />
                {name}
              </label>
            </div>
          ))}
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Salvar Perfil
        </button>
      </form>
    </div>
  );
}