export default function SignUpSecretForm() {
  return (
    <div className="flex">
      <form
        action="/api/secret"
        method="POST"
        className="form flex  items-start bg-primary-200 dark:bg-dark-primary-200 rounded"
      >
        <label htmlFor="secret" className="text-lg">
          Speak, friend, and enter:{' '}
        </label>
        <input className="px-3 py-2" type="text" name="secret" id="secret" />
        <button
          type="submit"
          className="px-3 py-2 border-white border-2 hover:bg-gray-700 transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
