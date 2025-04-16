import { useEffect } from "react";
import base from "../base";

type Props = {
  setScreen: React.Dispatch<
    React.SetStateAction<"menu" | "game" | "score" | "demo">
  >;
};

const Menu = ({ setScreen }: Props) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "s") {
        setScreen("game");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setScreen]);

  return (
    <div className="menu">
      <img src={`${base}/title.png`} alt="Game Title" className="title-image" />
      <div className="button-container">
        <img
          src={`${base}/play.png`}
          alt="Play"
          className="play-image"
          onClick={() => setScreen("game")}
        />
      </div>
      <div className="button-container">
        <button
          className="text-white bg-pink-400 rounded"
          onClick={() => setScreen("demo")}
        >
          demo
        </button>
      </div>
    </div>
  );
};

export default Menu;
