import { Movie } from "@prisma/client";
import Link from "next/link";

export default function MovieCard({ movie }: { movie: Movie }) {
    const { id, title, year, description } = movie

    return <Link href={`/movies/${id}`}>
        <article className="px-4 py-3 bg-slate-400 rounded border-2 hover:bg-slate-500 transition-all flex gap-6 justify-between items-end">
            <div>
                <h5>{title}</h5>
                <h6>{year}</h6>
                <p className="text-sm">{description}</p>
            </div>
            <div className="">
                <p className="text-sm">TODO: arvioita? Tykkäyswidget? Mitä haluaa nopeasti käyttää?</p>
            </div>

        </article></Link>
}