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



// Size set by parent
export default function NewVotingWidget(props: VotingWidgetProps) {

    const firstFocused = props.givenVote == null ? 1 :  props.givenVote?.voteType == "POSITIVE" ? 0 : props.givenVote?.voteType == "NEUTRAL" ? 1 : 2

    const [vote, setVote] = useState<VoteType | null>(props.givenVote?.voteType ?? null)
    const [loading, setLoading] = useState(false)
    const [focusIdx, setFocusIdx] = useState(firstFocused)
    const listRef = useRef<HTMLUListElement>(null)
    const [focusOpen, setFocusOpen] = useState(false)
    const [hoverOpen, setHoverOpen] = useState(false)
    const [displayRow, setDisplayRow] = useState<boolean>(true)

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


    const optionsOpen = focusOpen || hoverOpen

    const hasVoted = vote != null && vote !== "NONVOTE"

    async function sendVote(option: VoteType) {
        const result = await voteForEventMovie(props.movieEventId, option)
        setVote(result.voteType)
        setLoading(false)
        toast.success("Vote changed")
    }


    function voteToggler(option: VoteType) {

        return () => {
            if (loading) return;
            setLoading(true)
            sendVote(option)
        }

    }

    function innerKeyboardListener(e: ReactKeyboardEvent<HTMLLIElement>) {
        const idx = focusIdx
        let newIdx = -1
        switch (e.key) {

            case "ArrowLeft":
                e.preventDefault()
                newIdx = (idx - 1)
                if (newIdx < 0) {
                    newIdx = 2
                }
                break;
            case "ArrowRight":
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

    function focusTester(e: ReactFocusEvent<HTMLDivElement>) {
        //@ts-ignore
        const listIsTargetOfFocus = e.target?.classList.contains("group")
        if (listIsTargetOfFocus) {
            console.log('changing focus???')
            const focusEl = listRef.current?.children[focusIdx] as HTMLLIElement | null
            if (focusEl != null) {
                focusEl.focus({preventScroll: true})
            }
        }
        setFocusOpen(true)
        // setIsOptionsOpen(true)
    }

    function blurTester(e: ReactFocusEvent<HTMLDivElement>) {
        setFocusOpen(false)
        // setIsOptionsOpen(false)
    }


    return <div className="
    h-full w-full 
    flex items-stretch justify-center
    "
    style={{
        flexDirection: direction == "row" ? "row" : "column"
    }}
    >
        <div className="group  border-dashed border-2 border-black flex items-center justify-center  hover:cursor-pointer
        bg-gray-500 bg-opacity-100
        transition-all
        hover:bg-opacity-0  
        focus:bg-opacity-0
        "

            style={{
                width: direction == "row" ?  (optionsOpen ? "100%" : "33.333%") : "100%",
                height: direction == "column" ? (optionsOpen ? "100%" : "33.333%") : "100%",
            }}
            tabIndex={0}
            onFocus={focusTester}
            onBlur={blurTester}
            onMouseEnter={(e) => {setHoverOpen(true)}}
            onMouseLeave={(e) => {setHoverOpen(false)}}
        >
            {
                !optionsOpen && (
                    hasVoted ? <span className="text-sm block group-hover:hidden
                group-focus:hidden text-center">Voted</span> : <span className="text-sm block
                group-hover:hidden
                group-focus:hidden text-center">Vote</span>)
            }

            {
                 (
                    <div className="
            w-full h-full" style={{
                // For focusing on the voted element if the widgets gets focus
                opacity: optionsOpen ? 1 : 0,
                position: optionsOpen ? "relative" : "absolute",
                zIndex: optionsOpen ? 1 : -1
            }}>
                        <ul className="flex bg-blue-500
                w-full h-full
                items-stretch
                justify-between divide-x-4 md:divide-x-0 md:divide-y-4"
                            ref={listRef}
                            style={{
                                flexDirection: direction == "row" ? "row" : "column",
                            }}
                        >
                            {
                                voteOptions.map((option, idx) => {
                                    return <li className="
                                hover:border-8 hover:border-black
                                focus:border-8 focus:border-black
                            "
                                        // Todo: how to stylize the differenet options?
                                        style={{
                                            fontSize: vote === option ? "200%" : "inherit",
                                            width: direction == "row" ? "33.333%" : "100%",
                                            height: direction == "column" ? "33.333%" : "100%",
                                        }} key={option}
                                        onKeyDown={innerKeyboardListener}
                                        tabIndex={idx == focusIdx ? 0 : -1}
                                    >
                                        <VoteSymbol callback={voteToggler(option)}
                                            voteType={option}
                                        /></li>
                                })
                            }

                        </ul>
                    </div>
                )
            }

        </div>
    </div>

}

type VoteSymbolProps = {
    callback: () => void,
    voteType: VoteType
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