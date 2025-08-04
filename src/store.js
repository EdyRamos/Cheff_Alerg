// Global store for Chef Alerg
//
// This file defines a simple Zustand powered store for the game.  The
// store centralizes all mutable game state, including the current
// phase, the player's profile and any other cross cutting data.  In
// addition to reducing React prop drilling, a centralized store
// makes it trivial for non‑React code (like the Phaser engine) to
// read and update state via events.  See usage in GameWrapper and
// MemoryGame for examples.

import { create } from 'zustand';

export const useStore = create((set) => ({
  /**
   * The id of the current phase.  Changing this value will cause
   * GameWrapper to instantiate a new PhaserGameEngine with the
   * appropriate configuration.
   */
  currentPhase: null,
  setCurrentPhase: (phaseId) => set({ currentPhase: phaseId }),

  /**
   * The player's profile.  Contains name, age and allergen bitmask.
   */
  profile: null,
  setProfile: (profile) => set({ profile }),

  /**
   * A list of loaded phase configurations.  These are loaded from
   * JSON files at runtime.  Populating this cache avoids re‑fetching
   * phase files repeatedly when replaying levels.
   */
  phases: {},
  setPhaseConfig: (id, config) =>
    set((state) => ({ phases: { ...state.phases, [id]: config } })),

  /**
   * Tracks which phases have been unlocked by the player. The first
   * phase is unlocked by default so the game is playable on first
   * launch. Additional phases are added to this array as the player
   * progresses.
   */
  unlockedPhases: ['feira'],
  unlockPhase: (id) =>
    set((state) => ({
      unlockedPhases: state.unlockedPhases.includes(id)
        ? state.unlockedPhases
        : [...state.unlockedPhases, id],
    })),
}));