
interface BarGraphItem {
    value: number,
    label: string,
    color: string
}

interface BarGraphProps {
    data: BarGraphItem[]
}



// Control dimensions from the parent
export function BarGraph({ data }: BarGraphProps) {

    //const usedProportions = proportions;
    const usedProportions = data

    const total = usedProportions.map(e => e.value).reduce((acc, val) => acc + val, 0);
    const proportionsNormalized = usedProportions.map(e => e.value).map(val => val / total);
    const proportionsFormatted = proportionsNormalized.map(val => (val * 100).toFixed(2) + "%");


    return (<ul className="w-full h-full flex">
        {
            usedProportions.map((e, i) => {
                return (
                    <li key={e.label}
                        style={{ width: proportionsFormatted[i], backgroundColor: e.color }}
                        className="group relative"
                    >
                        <div className="hidden group-hover:block
                        absolute z-10
                        top-0 translate-y-[-105%] translate-x-[-50%] left-[50%] w-max  
                        py-2 px-4 rounded-md shadow-md
                        bg-informational
                        dark:bg-dark-informational
                        
                        ">
                            {e.label}: {proportionsFormatted[i]} ({e.value} votes)
                        </div>

                    </li>
                )
            })
        }
    </ul>)
}