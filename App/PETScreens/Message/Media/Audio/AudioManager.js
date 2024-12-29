// AudioManager.js
let currentSound = null;

export function getCurrentSound() {
  return currentSound;
}

export function setCurrentSound(sound) {
  currentSound = sound;
}

export async function stopCurrentSound() {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
  }
}
