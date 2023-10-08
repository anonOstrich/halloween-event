import SignUpSecretForm from "@/components/SignUpSecretForm";
import { getDBContents } from "@/utils/db";
import { SignUp } from "@clerk/nextjs";

async function hasProvidedSecret() {
    const db = await getDBContents()
    console.log('in db: ', db.halloweenSecret)
    return db.halloweenSecret === 'salaisuus'
}

export default async function Page() {
    const secretProvided = await hasProvidedSecret()

    if (false && !secretProvided) {
        return <SignUpSecretForm />
    }

    return <div className="flex justify-center mt-4"><SignUp /></div>
}