'use client'

// N.B. This has some performance impact
// https://tailwindcss.com/docs/configuration#referencing-in-java-script
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'

import { Vote, VoteType } from "@prisma/client"
import { useState, KeyboardEvent as ReactKeyboardEvent, useRef, FocusEvent as ReactFocusEvent, useEffect } from "react"
import { voteForEventMovie } from '@/utils/api'
import { useDarkThemeIsPreferred } from '@/utils/hooks'
import { toast } from 'react-toastify'


const fullConfig = resolveConfig(tailwindConfig)


type Direction = "row" | "column"

interface VotingWidgetProps {
    givenVote: Vote | undefined
    movieEventId: number
}

const voteOptions: Array<VoteType> = ["POSITIVE", "NEUTRAL", "NEGATIVE"]

const voteSymbols: Map<VoteType, string> = new Map([
    ["POSITIVE", "+1"],
    ["NEUTRAL", "0"],
    ["NEGATIVE", "-1"]
])



// Parent sets the size
// If width greater than height, display row
// Assumed that this is the case at the breakpoint md, which is used
// to set the type of spacing between the elements
export default function VotingWidget(props: VotingWidgetProps) {


    const firstFocused = props.givenVote != null ? (props.givenVote?.voteType == "POSITIVE" ? 0 : props.givenVote?.voteType == "NEUTRAL" ? 1 : 2) : 1

    const [vote, setVote] = useState<VoteType | null>(props.givenVote?.voteType ?? null)
    const [loading, setLoading] = useState(false)
    const [focusIdx, setFocusIdx] = useState(firstFocused)
    const [focusOpen, setFocusOpen] = useState(false)
    const [hoverOpen, setHoverOpen] = useState(false)
    const [displayRow, setDisplayRow] = useState<boolean>(true)
    const listRef = useRef<HTMLUListElement>(null)

    const optionsOpen = focusOpen || hoverOpen

    const hasVoted = vote != null && vote !== "NONVOTE"

    useEffect(() => {
        function handleResize() {
            const parent = document.getElementById(`parent-${props.movieEventId}`)
            const widerThanTaller = parent?.clientWidth! > parent?.clientHeight!
            setDisplayRow(widerThanTaller)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const direction: Direction = displayRow ? "row" : "column"




    async function sendVote(option: VoteType) {
        try {
            const result = await voteForEventMovie(props.movieEventId, option)
            setVote(result.voteType)
            toast.success("Vote changed")
        } catch (e) {
            toast.error("Failed to vote")
        } finally {
            setLoading(false)
        }

    }


    function voteToggler(option: VoteType) {

        return () => {
            if (loading) return;
            setLoading(true)
            sendVote(option)
        }

    }

    function navigationKeypressListener(e: ReactKeyboardEvent<HTMLLIElement>) {
        const idx = focusIdx
        let newIdx = -1
        switch (e.key) {

            case "ArrowLeft":
            case "ArrowUp":
                e.preventDefault()
                newIdx = (idx - 1)
                if (newIdx < 0) {
                    newIdx = 2
                }
                break;
            case "ArrowRight":
            case "ArrowDown":
                e.preventDefault()
                newIdx = idx + 1
                if (newIdx > 2) {
                    newIdx = 0
                }
                break;
            case "Enter":
                voteToggler(voteOptions[idx])()
                return;
            default:
                return;
        }
        const focusEl = listRef.current?.children[idx] as HTMLLIElement

        focusEl.blur()
        //@ts-ignore
        listRef.current?.children[newIdx].focus({ preventScroll: true })
        setFocusIdx(_ => newIdx)
    }

    function focusHandler(e: ReactFocusEvent<HTMLDivElement>) {
        //@ts-ignore
        const listIsTargetOfFocus = e.target?.classList.contains("group")
        // Shift focus on the voted element if the widget gets focus
        if (listIsTargetOfFocus) {
            const focusEl = listRef.current?.children[focusIdx] as HTMLLIElement | null
            if (focusEl != null) {
                focusEl.focus({ preventScroll: true })
                e.target.blur()
            }
        }
        setFocusOpen(true)
    }

    function blurHandler(e: ReactFocusEvent<HTMLDivElement>) {
        setFocusOpen(false)
    }

    function mouseEnterHandler() {
        setHoverOpen(true)
    }

    function mouseLeaveHandler() {
        setHoverOpen(false)
    }



    return <div className="h-full w-full flex items-stretch justify-center"
        style={{
            flexDirection: direction == "row" ? "row" : "column"
        }}>
        <div className="group  border-dashed border-2 border-black rounded-md flex items-center        justify-center  hover:cursor-pointer
         shadow-lg bg-accent-200 dark:bg-dark-accent-200
        transition-all
        hover:bg-opacity-0  
        focus:bg-opacity-0
        "
            style={{
                width: direction == "row" ? (optionsOpen ? "100%" : "33.333%") : "100%",
                height: direction == "column" ? (optionsOpen ? "100%" : "33.333%") : "100%",
            }}
            tabIndex={0}
            onFocus={focusHandler}
            onBlur={blurHandler}
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
        >

            {
                !optionsOpen && (<UnopenedComponent hasVoted={hasVoted} />)
            }

            {
                <div className="w-full h-full"
                    style={{
                        // For focusing on the voted element if the widgets gets focus
                        opacity: optionsOpen ? 1 : 0,
                        position: optionsOpen ? "relative" : "absolute",
                        zIndex: optionsOpen ? 1 : -1
                    }}>
                    <VoteSymbolList direction={direction} focusIdx={focusIdx} keydownHandler={navigationKeypressListener} vote={vote} listRef={listRef} voteCallbackCreator={voteToggler} />
                </div>
            }

        </div>
    </div>

}

interface UnopenedComponentProps {
    hasVoted: boolean

}

function UnopenedComponent(props: UnopenedComponentProps) {
    return props.hasVoted
        ?
        <span className="text-sm block group-hover:hidden
    group-focus:hidden text-center">Voted</span>
        :
        <span className="text-sm block
    group-hover:hidden
    group-focus:hidden text-center">Vote</span>
}

type VoteSymbolProps = {
    callback: () => void,
    voteType: VoteType
}

interface VoteSymbolListProps {
    listRef: React.RefObject<HTMLUListElement>,
    direction: Direction,
    vote: VoteType | null,
    keydownHandler: (e: ReactKeyboardEvent<HTMLLIElement>) => void,
    voteCallbackCreator: (vote: VoteType) => () => void
    focusIdx: number
}

function VoteSymbolList(props: VoteSymbolListProps) {
    const { listRef, direction, vote, keydownHandler, voteCallbackCreator, focusIdx } = props

    return (<ul className="flex bg-blue-500 w-full h-full items-stretch
                        justify-between divide-x-4 
                        md:divide-x-0 md:divide-y-4"
        ref={listRef}
        style={{
            flexDirection: direction == "row" ? "row" : "column",
        }}
    >
        {
            voteOptions.map((option, idx) => {

                const hasVotedForThis = vote === option

                return <li className="
                relative
                hover:text-4xl
                focus:text-4xl
                "

                    style={{
                        //backgroundColor: hasVotedForThis ? "red" : "blue",
                        // fontSize: vote === option ? "200%" : "inherit",
                        width: direction == "row" ? "33.333%" : "100%",
                        height: direction == "column" ? "33.333%" : "100%",
                    }} key={option}
                    onKeyDown={keydownHandler}
                    tabIndex={idx == focusIdx ? 0 : -1}
                >
                    <div className='before:content-[attr(data-content)] before:absolute
                    before:z-10
                    before:top-[inherit] before:left-[inherit]
                    before:text-2xl before:font-bold before:
                    before:transform before:-translate-x-1/2 before:-translate-y-1/2
                    w-full h-full'
                        data-content={hasVotedForThis ? "✔️" : ""}
                        style={{
                            top: direction == "row" ? "-30%" : "50%",
                            left: direction == "row" ? "50%" : "-50%"
                        }}
                    >
                        <VoteSymbol callback={voteCallbackCreator(option)}
                            voteType={option}
                        />
                    </div>
                </li>

            })
        }

    </ul>)
}

function VoteSymbol(props: VoteSymbolProps) {

    const darkThemeIsPreferred = useDarkThemeIsPreferred()


    const voteColors: Map<VoteType, string> = new Map([
        ["POSITIVE", (fullConfig.theme?.colors!)[darkThemeIsPreferred ? "dark-success" : "success"].toString() ?? "yellow"],
        ["NEUTRAL", "current"],
        ["NEGATIVE", (fullConfig.theme?.colors!)[darkThemeIsPreferred ? "dark-danger" : "danger"].toString() ?? "yellow"]
    ])

    const symbol = voteSymbols.get(props.voteType)
    return <div className="h-full w-full flex justify-center items-center" style={{
        backgroundColor: voteColors.get(props.voteType)
    }}
        onClick={props.callback}
    >
        {symbol}
    </div>
}