import { prisma } from "@/utils/db"


export default async function EventPage({params}: {params: {id: string}}) {
    const { id } = params

    const event = await prisma.event.findFirst({
        where: {
            id: Number(id)
        }
    })

    console.log(`event ${id}:`,  event)

    return <main>
        <h1>Event Page</h1>
        <p>You are viewing the page for the following event: {event?.title}</p>
        <p>Event created by: ???</p>

        <div>
            <h2>Details:</h2>
            <ul>
                <li>Location: ???</li>
                <li>Date: ??? (and: should there be a vote on this as well)</li>
                <li>Other description??</li>
                <li>Theme?</li>
            </ul>
        </div>

        <div>
            <h2>The movies you can vote for</h2>
            <ul>
                <li>Test</li>
                <li>Alaston ase</li>
            </ul>
        </div>
    </main>

}