
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl flex flex-col gap-3">
      <h1 className="text-orange-600 text-center">Cool People Movie Club Page</h1>
      <p>
        This a page for planning and reviewing movie watching sessions. At first meant just for my private friend group, but the ability to set up events for different groups might be  in the future. As of now, you need to ask the maintainer of the page for help with creating the account. If you know, you know ;)
      </p>

      <p>
        The page is still very much under construction. There is also a demo version, or you can try out locally with your own database by following the guidance in the <a href="/https://github.com/anonOstrich/halloween-event" className='text-blue-400 text-lg underline hover:text-blue-700'>GitHub repo</a>.
      </p>
    </main>
  )
}
