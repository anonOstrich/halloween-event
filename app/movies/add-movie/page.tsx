'use client'


import MovieApiSearch from "@/components/MovieApiSearch"
import { addNewMovie } from "@/utils/api"
import { useRouter } from "next/navigation"
import { FormEventHandler, useState } from "react"
import { toast,  } from "react-toastify"


export default function AddMoviePage() {
    const [title, setTitle] = useState<string>('')
    const [year, setYear] = useState<number>(2000)
    const [description, setDescription] = useState<string>('')


    const something = useRouter()



    function fillFormWithMovieDetails(title: string, year: number, description: string) {
        setTitle(title)
        setYear(year)
        setDescription(description)
    }

    const handleFormSubmission: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        addNewMovie(title, year, description)
        setTitle('')
        setYear(2000)
        setDescription('')
        toast.success('Successfully added')
        something.push('/movies')
        // TODO: redirect to the movie page? Maybe after a success message?
    }


    const currentYear = (new Date()).getFullYear()
    

    return <main className="max-w-2xl mx-auto">
        <p>TODO: Ohjeistus. (Minkälainen on hyvä? Mitä toiveita on elokuville? Mitä rajoja ihmisillä on elokuville?)</p>
        <MovieApiSearch completeMovieInformationCallBack={fillFormWithMovieDetails} />
        <form onSubmit={handleFormSubmission} className="flex flex-col gap-10">
            <div className="flex justify-center gap-4">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div className="flex justify-center gap-4">
                <label htmlFor="year">Year</label>
                <input id="year" name="year" type="number" min={1880} max={currentYear} 
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                required />
            </div>

            <div className="flex justify-center gap-4">
                <label htmlFor="description" className="align-self-center self-center">Description</label>
                <textarea name="description" id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required></textarea>

            </div>

            <button type="submit" className='button'>Submit</button>
        </form></main>
}