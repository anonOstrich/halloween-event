'use client';

import { Vote, VoteType } from '@prisma/client';
import {
  useState,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  FocusEvent as ReactFocusEvent,
  useEffect
} from 'react';
import { toast } from 'react-toastify';
import UnopenedComponent from './UnopenedWidget';
import InteractiveComponent from './InteractiveComponent';

export type Direction = 'row' | 'column';

interface VotingWidgetProps {
  givenVote: Vote | undefined;
  movieEventId: number;
  sendVote: (vote: VoteType) => void;
}

const voteOptions: Array<VoteType> = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];

// Parent sets the size
// If width greater than height, display row
// Assumed that this is the case at the breakpoint md, which is used
// to set the type of spacing between the elements
export default function VotingWidget(props: VotingWidgetProps) {
  const firstFocused =
    props.givenVote != null
      ? voteOptions.indexOf(props.givenVote?.voteType)
      : 1;

  const [loading, setLoading] = useState(false);
  const [focusIdx, setFocusIdx] = useState(firstFocused);
  const [focusOpen, setFocusOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [displayRow, setDisplayRow] = useState<boolean>(true);
  const listRef = useRef<HTMLUListElement>(null);

  const vote = props.givenVote?.voteType ?? null;

  const optionsOpen = focusOpen || hoverOpen;

  const sendVote = props.sendVote;

  // Potential: a separate hook!
  // Change property based on the size of an element
  useEffect(() => {
    function handleResize() {
      const parent = document.getElementById(`parent-${props.movieEventId}`);
      const widerThanTaller = parent?.clientWidth! > parent?.clientHeight!;
      setDisplayRow(widerThanTaller);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const direction: Direction = displayRow ? 'row' : 'column';

  function voteToggler(option: VoteType) {
    return async () => {
      if (loading) return;
      if (!optionsOpen) return;
      setLoading(true);
      try {
        await sendVote(option);
        toast.success('Vote changed');
      } catch (e) {
        toast.error('Vote change failed');
      } finally {
        setLoading(false);
      }
    };
  }

  function navigationKeypressListener(e: ReactKeyboardEvent<HTMLLIElement>) {
    const idx = focusIdx;
    let newIdx = -1;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIdx = idx - 1;
        if (newIdx < 0) {
          newIdx = 2;
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIdx = idx + 1;
        if (newIdx > 2) {
          newIdx = 0;
        }
        break;
      case 'Enter':
        voteToggler(voteOptions[idx])();
        return;
      default:
        return;
    }
    const focusEl = listRef.current?.children[idx] as HTMLLIElement;

    focusEl.blur();
    //@ts-ignore
    listRef.current?.children[newIdx].focus({ preventScroll: true });
    setFocusIdx((_) => newIdx);
  }

  function focusHandler(e: ReactFocusEvent<HTMLDivElement>) {
    //@ts-ignore
    const listIsTargetOfFocus = e.target?.classList.contains('group');
    // Shift focus on the voted element if the widget gets focus
    if (listIsTargetOfFocus) {
      const focusEl = listRef.current?.children[
        focusIdx
      ] as HTMLLIElement | null;
      if (focusEl != null) {
        focusEl.focus({ preventScroll: true });
        e.target.blur();
      }
    }
    setFocusOpen(true);
  }

  function blurHandler(e: ReactFocusEvent<HTMLDivElement>) {
    setFocusOpen(false);
  }

  function mouseEnterHandler() {
    setHoverOpen(true);
  }

  function mouseLeaveHandler() {
    setHoverOpen(false);
  }

  return (
    <div
      className="h-full w-full flex items-stretch justify-center"
      style={{
        flexDirection: direction == 'row' ? 'row' : 'column'
      }}
    >
      <div
        className="group  border-dashed border-2 border-black rounded-md flex items-center        justify-center  hover:cursor-pointer
         shadow-lg bg-accent-200 dark:bg-dark-accent-200
        transition-all
        hover:bg-opacity-0  
        focus:bg-opacity-0
        "
        aria-disabled={loading}
        style={{
          width:
            direction == 'row' ? (optionsOpen ? '100%' : '33.333%') : '100%',
          height:
            direction == 'column' ? (optionsOpen ? '100%' : '33.333%') : '100%',
          transform: loading ? 'scale(0.8)' : 'scale(1)'
        }}
        tabIndex={0}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        // Otherwise clicking will also imediately vote
        onTouchEnd={(e) => {
          if (!optionsOpen) {
            mouseEnterHandler();
            e.preventDefault();
          }
        }}
      >
        {!optionsOpen && <UnopenedComponent voteType={vote} />}

        <InteractiveComponent
          direction={direction}
          focusIdx={focusIdx}
          optionsOpen={optionsOpen}
          vote={vote}
          listRef={listRef}
          voteToggler={voteToggler}
          navigationKeypressListener={navigationKeypressListener}
        />
      </div>
    </div>
  );
}
