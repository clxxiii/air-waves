import { useEffect, useState } from "react";
import "./App.css";
import base from "../base";

type Song = {
  id: string;
  name: string;
  artist: string;
};

type Props = {
  setScreen: React.Dispatch<
    React.SetStateAction<"menu" | "game" | "score" | "demo">
  >;
  setLevel: React.Dispatch<React.SetStateAction<string | null>>;
};

const originalSongs: Song[] = [
  { id: `hello`, name: "Soldier Poet King", artist: "The Oh Hellos" },
  { id: `lorelei`, name: "Lorelei", artist: "Camellia" },
  { id: `pipe-dream`, name: "Pipe Dream", artist: "Animusic" },
];

const Game = ({ setScreen, setLevel }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleArrowClick = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right" && currentIndex < originalSongs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleScroll = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      handleArrowClick("left");
    } else if (e.deltaY > 0) {
      handleArrowClick("right");
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [currentIndex]);

  const handleSelectClick = () => {
    const selectedSong = originalSongs[currentIndex];
    setLevel(selectedSong.id);
  };

  return (
    <div className="game">
      <div className="game-content">
        <img
          src={`${base}/songselect.png`}
          alt="Select a Song"
          className="song-select-title"
        />
        <div className="carousel-container">
          <button
            className="arrow left-arrow"
            onClick={() => handleArrowClick("left")}
            disabled={currentIndex === 0}
          >
            &#8249;
          </button>
          <div className="carousel-viewport">
            {originalSongs.map((song, i) => {
              const isActive = i === currentIndex;

              return (
                <div
                  key={song.id}
                  className={`carousel-song ${isActive ? "active" : ""}`}
                  style={{
                    display: isActive ? "flex" : "none",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "150px",
                    width: "300px",
                    backgroundColor: isActive ? "#8f48b7" : "#54bed8",
                    border: "2px solid #444",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="song-title" style={{ fontSize: "1.2rem" }}>
                    {song.name}
                  </div>
                  <div className="song-details" style={{ fontSize: "0.9rem" }}>
                    {song.artist}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="arrow right-arrow"
            onClick={() => handleArrowClick("right")}
            disabled={currentIndex === originalSongs.length - 1}
          >
            &#8250;
          </button>
        </div>
        <img
          src={`${base}/select.png`}
          alt="Select"
          className="back-image"
          onClick={handleSelectClick}
        />
        <img
          src={`${base}/back.png`}
          alt="Back to Menu"
          className="back-image"
          onClick={() => setScreen("menu")}
        />
      </div>
    </div>
  );
};

export default Game;
