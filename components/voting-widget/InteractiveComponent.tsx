import { VoteType } from '@prisma/client';
import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Direction } from './VotingWidget';
import VoteSymbolList from './VoteSymbolList';

interface InteractiveComponentProps {
  direction: Direction;
  focusIdx: number;
  optionsOpen: boolean;
  vote: VoteType | null;
  listRef: React.RefObject<HTMLUListElement>;
  voteToggler: (option: VoteType) => () => Promise<void>;
  navigationKeypressListener: (e: ReactKeyboardEvent<HTMLLIElement>) => void;
}

export default function InteractiveComponent(props: InteractiveComponentProps) {
  const {
    direction,
    focusIdx,
    optionsOpen,
    vote,
    listRef,
    voteToggler,
    navigationKeypressListener
  } = props;
  return (
    <div
      className="w-full h-full"
      style={{
        // For focusing on the voted element if the widgets gets focus
        opacity: optionsOpen ? 1 : 0,
        position: optionsOpen ? 'relative' : 'absolute',
        zIndex: optionsOpen ? 1 : -1
      }}
    >
      <VoteSymbolList
        direction={direction}
        focusIdx={focusIdx}
        keydownHandler={navigationKeypressListener}
        vote={vote}
        listRef={listRef}
        voteCallbackCreator={voteToggler}
      />
    </div>
  );
}
