'use client'

// N.B. This has some performance impact
// https://tailwindcss.com/docs/configuration#referencing-in-java-script
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'

import { Vote, VoteType } from "@prisma/client"
import { KeyboardEventHandler, useState, KeyboardEvent as ReactKeyboardEvent, useRef, FocusEvent as ReactFocusEvent } from "react"
import { voteForEventMovie } from '@/utils/api'
import { useDarkThemeIsPreferred } from '@/utils/hooks'


const fullConfig = resolveConfig(tailwindConfig)


type Direction = "row" | "column"

interface VotingWidgetProps {
    direction: Direction,
    givenVote: Vote | undefined
    movieEventId: number
}

const voteOptions: Array<VoteType> = ["POSITIVE", "NEUTRAL", "NEGATIVE"]

const voteSymbols: Map<VoteType, string> = new Map([
    ["POSITIVE", "+1"],
    ["NEUTRAL", "0"],
    ["NEGATIVE", "-1"]
])



//TODO: must also work for non-hoverers (mobile, keyboard users)
// Size set by parent
export default function NewVotingWidget(props: VotingWidgetProps) {


    const [vote, setVote] = useState<VoteType | null>(props.givenVote?.voteType ?? null)
    const [loading, setLoading] = useState(false)
    const [focusIdx, setFocusIdx] = useState(1)
    // const focusRef = useRef<HTMLLIElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const [optionsOpen, setIsOptionsOpen] = useState(true)




    const hasVoted = vote != null && vote !== "NONVOTE"

    async function sendVote(option: VoteType) {
        const result = await voteForEventMovie(props.movieEventId, option)
        setVote(result.voteType)
        setLoading(false)
    }


    function voteToggler(option: VoteType) {

        return () => {
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
            const focusEl = listRef.current?.children[focusIdx] as HTMLLIElement
            focusEl.focus()
        }

    }

    function blurTester() {
        console.log("blur tester fired")
    }

    return <div className="
    h-full w-full 
    flex items-stretch justify-center
    ">
        <div className="group  h-full border-dashed border-2 border-black flex items-center justify-center  hover:cursor-pointer
        bg-gray-500 bg-opacity-100
        transition-all
        hover:bg-opacity-0  
        focus:bg-opacity-0
        "

            style={{
                width: optionsOpen ? "100%" : "33.333%",
            }}
            tabIndex={0}
            onFocus={focusTester}
        // onBlur={blurTester}
        >
            {
                !optionsOpen && (
                    hasVoted ? <span className="text-sm block group-hover:hidden
                group-focus:hidden">Voted</span> : <span className="text-sm block
                group-hover:hidden
                group-focus:hidden">Vote</span>)
            }

            {
                optionsOpen && (
                    <div className="
            w-full h-full" style={{
                            display: loading ? "none" : "inherit",
                        }}>
                        <ul className="flex bg-blue-500
                w-full
                items-stretch justify-between divide-x-4 h-full"
                            ref={listRef}
                        >
                            {
                                voteOptions.map((option, idx) => {
                                    return <li className="w-[33%]
                                hover:border-8 hover:border-black
                                focus:border-8 focus:border-black
                            "
                                        // Todo: how to stylize the differenet options?
                                        style={{
                                            fontSize: vote === option ? "200%" : "inherit"
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


    // TODO: figure out whether dark mode is on. Create a dark mode hook for the client
    const voteColors: Map<VoteType, string> = new Map([
        ["POSITIVE", (fullConfig.theme?.colors!)[darkThemeIsPreferred ? "dark-success" : "success"].toString() ?? "yellow"],
        ["NEUTRAL", "current"],
        ["NEGATIVE", (fullConfig.theme?.colors!)[darkThemeIsPreferred ? "dark-danger" : "danger"].toString() ?? "yellow"]
    ])



    const symbol = voteSymbols.get(props.voteType)
    return <div className="h-full w-full flex justify-center items-center" style={{
        backgroundColor: voteColors.get(props.voteType)
    }} onClick={props.callback}>
        {symbol}
    </div>
}