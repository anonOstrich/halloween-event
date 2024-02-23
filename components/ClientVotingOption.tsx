'use client';

import { Vote, VoteType } from '@prisma/client';
import { useEffect, useState } from 'react';
import VotingStatistics from './VotingStatistics';
import VotingWidget from './VotingWidget';
import { getVotesForEventMovie, voteForEventMovie } from '@/utils/api';
import { prisma } from '@/utils/db';

const name = 'ghaha';

interface ClientVotingOptionProps {
  posVotes: number;
  neutralVotes: number;
  negVotes: number;
  givenVote?: Vote;
  movieEventId: number;
}

export function ClientVotingOption(props: ClientVotingOptionProps) {
  const [votes, setVotes] = useState({
    posVotes: props.posVotes,
    neutralVotes: props.neutralVotes,
    negVotes: props.negVotes
  });

  const [givenVote, setGivenVote] = useState(props.givenVote);
  const { posVotes, neutralVotes, negVotes } = votes;

  async function fetchVotes() {
    const votes = await getVotesForEventMovie(props.movieEventId);
    setVotes(votes);
  }
  useEffect(() => {
    fetchVotes();
  }, [givenVote]);

  async function sendVote(option: VoteType) {
    const result = await voteForEventMovie(props.movieEventId, option);
    setGivenVote(result);
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
      <VotingStatistics votes={{ posVotes, neutralVotes, negVotes }} />

      <div
        className="h-16 w-48 md:h-48 md:w-16"
        id={`parent-${props.movieEventId}`}
      >
        <VotingWidget
          givenVote={givenVote}
          movieEventId={props.movieEventId}
          sendVote={sendVote}
        />
      </div>
    </div>
  );
}
