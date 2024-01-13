'use client'

import { useState } from "react"


interface ExperimentalThumbsUpWidgetProps {
    config: {
        min: number,
        max: number
    },
    input: {
        score: number
    }
}
export default function ExperimentalThumbsUpWidget(props: ExperimentalThumbsUpWidgetProps) {

    // These will probably not change in reality
    const { min, max } = props.config

    const { score } = props.input

    const [rangeValue, setRangeValue] = useState(score)

    const rotationFr = (rangeValue / (max - min)) * 180
    const rotationInDegrees =  Math.ceil(180 - rotationFr)

    // Style object, because run-time classes not doable with tailwind
    const rotationStyle = {
        transform: `translateX(-50%) translateY(-50%) rotate(${rotationInDegrees}deg) `,
        transformOrigin: 'center center',
        top: '50%',
        left: '50%',
    }

    const greenPercentage = rangeValue / max
    const redPercentage = 1 - greenPercentage
    return (
        <div className="width-full flex justify-stretch items-center min-width-[500px] gap-5">
            <label htmlFor="movie-score">Thumbs up slider</label>
            <div className="flex flex-col items-center gap-3">

            <div className="rounded-full relative p-7" style={{

                backgroundColor: `color-mix(in hsl shorter hue, red ${redPercentage * 100}%, green)`
            }}>
                <span className="block absolute" style={rotationStyle}>👍</span>
            </div>
            <input name="movie-score" id="movie-score" type="range" min={min} max={max} value={rangeValue} onChange={(e) => {setRangeValue(Number(e.target.value))}} />
            <div>
                <span>{rangeValue} ({min}-{max})</span>
            </div>
            </div>
        </div>
    )
}