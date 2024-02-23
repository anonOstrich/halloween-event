'use client';

import tailwindConfig from '@/tailwind.config';
import { useDarkThemeIsPreferred } from '@/utils/hooks';
import { VoteType } from '@prisma/client';
import resolveConfig from 'tailwindcss/resolveConfig';

const fullConfig = resolveConfig(tailwindConfig);

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
    [
      'POSITIVE',
      fullConfig.theme?.colors![
        darkThemeIsPreferred ? 'dark-success' : 'success'
      ].toString() ?? 'yellow'
    ],
    ['NEUTRAL', 'current'],
    [
      'NEGATIVE',
      fullConfig.theme?.colors![
        darkThemeIsPreferred ? 'dark-danger' : 'danger'
      ].toString() ?? 'yellow'
    ]
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
