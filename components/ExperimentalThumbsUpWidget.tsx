


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

    const { min, max } = props.config

    const { score } = props.input



    // Dynamically adjust: 1) the background color and 2) the rotaiton of the thumb

    const color = score < 8 ? "red" : score < 16 ? "yellow" : "green"

    console.log('score: ', score)


    const rotationFr = (score / (max - min)) * 180
    const rotationInDegrees =  Math.ceil(180 - rotationFr)
   
    const rotatePart = `rotate-${rotationInDegrees}`
    const emojiTailwindClass = 'block absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]' + rotatePart
    console.log('rotationFr: ', rotationFr)
    console.log('rotationInDegrees: ', rotationInDegrees)
    // TODO: check the rotation point to be at the center of the emoji!
    const nameForClass = `bg-${color}-700 p-7 rounded-full relative`


    const rotationStyle = {
        transform: `translateX(-50%) translateY(-50%) rotate(${rotationInDegrees}deg) `,
        transformOrigin: 'center center',
        top: '50%',
        left: '50%'
    }
    console.log('nameForClass: ', nameForClass)
    return (
        <div className="width-full flex justify-stretch items-center min-width-[500px] gap-5">
            <label htmlFor="rating-score">Thumbs up slider</label>
            <input name="rating-score" id="rating-score" type="range" min={min} max={max} />
            <div className={nameForClass}>
                <span className="block absolute" style={rotationStyle}>👍</span>
            </div>
        </div>
    )
}