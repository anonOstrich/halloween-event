import FormRow from "@/components/FormRow";
import { createEvent } from "@/utils/server-actions";
import { redirect } from "next/navigation";


async function handleSubmit(data: FormData) {
    'use server'
    const description = data.get('event-description')?.toString()!
    const title = data.get('event-title')?.toString()!
    const theme = data.get('event-theme')?.toString()!
    const plannedDate = new Date(data.get('event-date')?.toString()!)
    const createdEvent = await createEvent(title, description, plannedDate, theme)

    return redirect(`/events/${createdEvent.id}`)
}

export default async function CreateEventPage() {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);


    return <div>
        <h1 className="text-center">Create New Event</h1>

        <form action={handleSubmit} className="form">
            <FormRow displayValue="Title" separateDisplayValue name="event-title" type="text" value="" />
            <FormRow displayValue="Theme" separateDisplayValue name="event-theme" type="text" value="" />
            <FormRow displayValue="Description" separateDisplayValue name="event-description" type="textarea" value="" />

            <FormRow displayValue="Date" separateDisplayValue name="event-date" type="date" value={defaultDate.toISOString().split('T')[0]} />
            <button className="m-auto" type="submit">Confirm</button>
        </form>
    </div>
}