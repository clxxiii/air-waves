type Props = {
    setScreen: React.Dispatch<React.SetStateAction<'menu' | 'game' | 'score'>>;
  };
  
  const Menu = ({ setScreen }: Props) => {
    return (
      <div className="menu">
        <img src="title.png" alt="Game Title" className="title-image" />
        <div className="button-container">
          <img
            src="play.png"
            alt="Play"
            className="play-image"
            onClick={() => setScreen('game')}
          />
        </div>
      </div>
    );
  };
  
  export default Menu;
