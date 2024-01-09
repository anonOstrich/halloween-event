import { getUserId } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { updateMovie } from "@/utils/server-actions"
import Link from "next/link"
import { redirect } from "next/navigation"


//TODO: can you toast from the server...? Probably not - unless you start on the initial page load after the redirect?
async function serverHandleMovieEditSubmit(data: FormData) {
    'use server'
    const id = Number(data.get('movie-id'))
    const title = data.get('movie-title')?.toString()
    const year = Number(data.get('movie-year'))
    const description = data.get('movie-description')?.toString()

    if (title == null || description == null) {
        console.error(`Title or description of the update is nullish`)
        return redirect(`/movies/${id}`)
    }

    const updatedMovie = await updateMovie(id, title, year, description)
    //TODO: Add JSON.prettyStringify in the project
    console.log(`Movie after the update: `, JSON.stringify(updatedMovie, null, 2))

    return redirect(`/movies/${id}`)
}


export default async function MovieEditPage({params}: {params: {id: string}}) {
    const id = Number(params.id)
    const userId = await getUserId()

    // TODO: Same level of authorization for deleting movies as well
    // Already some authorization!
    const movie = await prisma.movie.findFirstOrThrow({
        where: {
            id: id,
            userId: userId
        }
    })

    return <main>
        <h3>Edit {movie.title}</h3>
        <form action={serverHandleMovieEditSubmit}>
            <input type="hidden" name="movie-id" value={movie.id} />
            <FormRow displayValue="Title" name="movie-title" type="text" separateDisplayValue value={movie.title}/>

            <FormRow value={movie.year} displayValue="Release year" separateDisplayValue name="movie-year" type="number" />


            <FormRow value={movie.description} displayValue="Description" separateDisplayValue name="movie-description" type="textarea" />

            <button type="submit">Save</button>
        </form>
        <Link href={`/movies/${movie.id}`}>Cancel</Link>
    </main>
}


// TODO: this is wonky
// Fix A: easier creation and discriminant
// Fix B: type and value type should match as well
interface BaseProps {
    separateDisplayValue: boolean,
    name: string,
    type: 'text' | 'number' | 'textarea',
    value: string | number
}

interface FormRowPropsWithoutDisplayValue extends BaseProps {
    separateDisplayValue: false
}

interface FormRowPropsWithDisplayValue extends BaseProps {
    separateDisplayValue: true,
    displayValue: string
}

type FormRowProps = FormRowPropsWithDisplayValue | FormRowPropsWithoutDisplayValue

function FormRow(props: FormRowProps) {

    const label = props.separateDisplayValue ? props.displayValue : props.name

    // TODO: better validation client side (e.g. max length, numerical limits...)
    const inputElement = props.type === 'textarea' ? 
        <textarea defaultValue={props.value} id={props.name} name={props.name} /> 
        : <input type={props.type} defaultValue={props.value} name={props.name} id={props.name}/>;

    return <div>
        <label htmlFor={props.name}>{label}</label>
        {inputElement}
    </div>
}