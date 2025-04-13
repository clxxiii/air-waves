import { useEffect, useRef, useState } from 'react';
import './app.css';

type Song = {
  id: number;
  name: string;
  artist: string;
  duration: string;
};

type Props = {
  setScreen: React.Dispatch<React.SetStateAction<'menu' | 'game' | 'score'>>;
};

const originalSongs: Song[] = [
  { id: 1, name: 'Electric Rush', artist: 'Synth Nova', duration: '3:45' },
  { id: 2, name: 'Neon Drive', artist: 'Retro Pulse', duration: '4:20' },
  { id: 3, name: 'Digital Horizon', artist: 'Cyber Sky', duration: '2:58' },
  { id: 4, name: 'Pixel Love', artist: 'Lo-Fi Lights', duration: '3:30' },
];

const loopedSongs = [...originalSongs, ...originalSongs, ...originalSongs];

const Game = ({ setScreen }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(Math.floor(loopedSongs.length / 2));
  const [cooldown, setCooldown] = useState(false);

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    const itemHeight = container?.children[0]?.clientHeight || 1;
    container?.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
    setScrollIndex(index);
  };

  const handleWheel = (e: WheelEvent) => {
    if (cooldown) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 1000);

    const direction = e.deltaY > 0 ? 1 : -1;
    scrollToIndex(scrollIndex + direction);
  };

  const handleSongClick = (song: Song) => {
    console.log(`Selected song: ${song.name} by ${song.artist}`);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const itemHeight = container.children[0]?.clientHeight || 0;
    container.scrollTop = scrollIndex * itemHeight;

    const handleWheelBound = (e: WheelEvent) => handleWheel(e);
    container.addEventListener('wheel', handleWheelBound, { passive: false });

    return () => container.removeEventListener('wheel', handleWheelBound);
  }, [scrollIndex, cooldown]);

  return (
    <div className="game">
      <div className="game-content">
      <img src="songselect.png" alt="Select a Song" className="song-select-title" />
        <div className="carousel-viewport" ref={scrollRef}>
          {loopedSongs.map((song, i) => {
            const distance = Math.abs(i - scrollIndex);
            const opacity = Math.max(1 - distance * 0.4, 0);
            const scale = Math.max(1 - distance * 0.05, 0.9);
            const isActive = i === scrollIndex;

            return (
              <div
                key={`${song.id}-${i}`}
                className={`carousel-song ${isActive ? 'active' : ''}`}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
                onClick={() => handleSongClick(song)}
              >
                <div className="song-title">{song.name}</div>
                <div className="song-details">{song.artist} • {song.duration}</div>
              </div>
            );
          })}
        </div>
        <img
          src="select.png"
          alt="Select"
          className="back-image"
          onClick={() => console.log('Select button clicked')}
        />
        <img
          src="back.png"
          alt="Back to Menu"
          className="back-image"
          onClick={() => setScreen('menu')}
        />
      </div>
    </div>
  );
};

export default Game;
