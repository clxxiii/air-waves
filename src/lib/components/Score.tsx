import React from 'react';
import youRockImage from '../../../public/yourock.png';

type Props = {
  score: number;
  setScreen: React.Dispatch<React.SetStateAction<'menu' | 'game' | 'score'>>;
};

const Score = ({ score, setScreen }: Props) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Congratulations!</h1>
      <h2>Your Score: {score}%</h2>
      <img src={youRockImage} alt="You Rock" style={{ width: '300px', marginTop: '20px' }} />
      <br />
      <button onClick={() => setScreen('menu')} style={{ marginTop: '30px' }}>Back to Menu</button>
    </div>
  );
};

export default Score;
