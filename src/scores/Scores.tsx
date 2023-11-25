import { Root } from '../Root';
import { capitalizeFirstLetter } from '../utils/common';
import { useStorage } from '../utils/useStorage';

export const Scores = () => {
  const [allScores] = useStorage('scores');
  console.log('🔍 ~ Scores ~ allScores:', allScores);

  const scoreCount = Array.from({ length: 3 });

  return (
    <Root>
      <h1 className="px-8 py-4 text-2xl border-topDark-lg whitespace-nowrap mb-2 font-bold">
        🎊 High Scores 🎊
      </h1>
      <div className="border-topDark-lg">
        {Object.entries(allScores).map(([difficulty, scores]) => (
          <div key={difficulty} className="p-2">
            <h4 className="font-semibold text-lg">
              {capitalizeFirstLetter(difficulty)}
            </h4>
            <ol>
              {scoreCount.map((_, i) => (
                <li key={i} className="flex gap-1 pl-2">
                  <div>{i + 1}.</div>
                  <div>{scores[i]}</div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Root>
  );
};
