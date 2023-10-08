export default function SignUpSecretForm() {
    return <div>
        <form action="/api/secret" method="POST" className="flex flex-col max-w-lg mx-auto gap-2">
            <label htmlFor="secret">Kirjoitahan salaisuus: </label>
            <input className="text-black px-3 py-2" type="text" name="secret" id="secret" />
            <button type="submit" className="px-3 py-2 border-white border-2 hover:bg-gray-700 transition-all">Lähetä</button>
        </form>
    </div>
}