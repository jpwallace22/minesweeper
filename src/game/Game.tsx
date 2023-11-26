import { Root } from '../Root';
import { Grid } from './Grid';
import { ScoreBar } from './ScoreBar';

function Game() {
  return (
    <Root>
      <div className="bg-black">
        <ScoreBar />
        <Grid />
      </div>
    </Root>
  );
}

export default Game;
