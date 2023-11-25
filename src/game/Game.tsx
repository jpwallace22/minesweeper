import { Root } from '../Root';
import { Grid } from './Grid';
import { ScoreBar } from './ScoreBar';

function App() {
  return (
    <Root>
      <div className="bg-black">
        <ScoreBar />
        <Grid />
      </div>
    </Root>
  );
}

export default App;
