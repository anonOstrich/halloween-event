import { VoteType } from '@prisma/client';
import VoteSymbol from './VoteSymbol';

interface UnopenedComponentProps {
  voteType: VoteType | null;
}

export default function UnopenedComponent(props: UnopenedComponentProps) {
  const hasVoted = props.voteType !== null && props.voteType !== 'NONVOTE';
  const vote = props.voteType;

  const oldEl = (
    <span
      className="text-sm block group-hover:hidden
    group-focus:hidden text-center"
      // Placeholder: see that the vote data flows correctly
      style={{
        backgroundColor:
          vote === 'POSITIVE' ? 'green' : vote === 'NEUTRAL' ? 'gray' : 'red'
      }}
    >
      Voted
    </span>
  );

  const newEl = <VoteSymbol callback={() => {}} voteType={vote ?? 'NEUTRAL'} />;

  return hasVoted ? (
    newEl
  ) : (
    <span
      className="text-sm block
    group-hover:hidden
    group-focus:hidden text-center"
    >
      Vote
    </span>
  );
}
