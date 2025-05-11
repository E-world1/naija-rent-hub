
// Sound effect utility to play notification sounds for messages and calls

/**
 * Play a sound effect
 * @param soundType The type of sound to play
 */
export const playSound = (soundType: 'message' | 'call' | 'hangup') => {
  let soundUrl = '';
  
  switch (soundType) {
    case 'message':
      soundUrl = 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3';
      break;
    case 'call':
      soundUrl = 'https://assets.mixkit.co/active_storage/sfx/1821/1821-preview.mp3';
      break;
    case 'hangup':
      soundUrl = 'https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3';
      break;
  }
  
  if (soundUrl) {
    const audio = new Audio(soundUrl);
    audio.play().catch(e => console.error('Error playing sound:', e));
  }
};

// Add a global type for the window.callTimerId property
declare global {
  interface Window {
    callTimerId?: ReturnType<typeof setTimeout>;
  }
}

export default playSound;
