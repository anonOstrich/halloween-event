import { useDarkThemeIsPreferred } from '@/utils/hooks';
import { getTWThemeColor } from '@/utils/tw-theme-values';
import { VoteType } from '@prisma/client';

const voteSymbols: Map<VoteType, string> = new Map([
  ['POSITIVE', '+1'],
  ['NEUTRAL', '0'],
  ['NEGATIVE', '-1']
]);

type VoteSymbolProps = {
  callback: () => void;
  voteType: VoteType;
};

export default function VoteSymbol(props: VoteSymbolProps) {
  const darkThemeIsPreferred = useDarkThemeIsPreferred();

  const voteColors: Map<VoteType, string> = new Map([
    ['POSITIVE', getTWThemeColor('success', darkThemeIsPreferred)],
    ['NEUTRAL', getTWThemeColor('primary-200', darkThemeIsPreferred)],
    ['NEGATIVE', getTWThemeColor('danger', darkThemeIsPreferred)]
  ]);

  const symbol = voteSymbols.get(props.voteType);
  return (
    <div
      className="h-full w-full flex justify-center items-center"
      style={{
        backgroundColor: voteColors.get(props.voteType)
      }}
      onClick={props.callback}
    >
      {symbol}
    </div>
  );
}
