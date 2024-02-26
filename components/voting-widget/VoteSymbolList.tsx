import { VoteType } from '@prisma/client';
import { Direction } from './VotingWidget';
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import VoteSymbol from './VoteSymbol';

const voteOptions: Array<VoteType> = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];

interface VoteSymbolListProps {
  listRef: React.RefObject<HTMLUListElement>;
  direction: Direction;
  vote: VoteType | null;
  keydownHandler: (e: ReactKeyboardEvent<HTMLLIElement>) => void;
  voteCallbackCreator: (vote: VoteType) => () => void;
  focusIdx: number;
}

export default function VoteSymbolList(props: VoteSymbolListProps) {
  const {
    listRef,
    direction,
    vote,
    keydownHandler,
    voteCallbackCreator,
    focusIdx
  } = props;

  return (
    <ul
      className="flex bg-blue-500 w-full h-full items-stretch
                        justify-between divide-x-4 
                        md:divide-x-0 md:divide-y-4"
      ref={listRef}
      style={{
        flexDirection: direction == 'row' ? 'row' : 'column'
      }}
    >
      {voteOptions.map((option, idx) => {
        const hasVotedForThis = vote === option;

        return (
          <li
            className="
                relative
                hover:text-4xl
                focus:text-4xl
                "
            style={{
              width: direction == 'row' ? '33.333%' : '100%',
              height: direction == 'column' ? '33.333%' : '100%'
            }}
            key={option}
            onKeyDown={keydownHandler}
            tabIndex={idx == focusIdx ? 0 : -1}
          >
            <div
              className="before:content-[attr(data-content)] before:absolute
                    before:z-10
                    before:top-[inherit] before:left-[inherit]
                    before:text-2xl before:font-bold before:
                    before:transform before:-translate-x-1/2 before:-translate-y-1/2
                    w-full h-full"
              data-content={hasVotedForThis ? '✔️' : ''}
              style={{
                top: direction == 'row' ? '-30%' : '50%',
                left: direction == 'row' ? '50%' : '-50%'
              }}
            >
              <VoteSymbol
                callback={voteCallbackCreator(option)}
                voteType={option}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
