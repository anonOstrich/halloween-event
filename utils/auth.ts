import { env } from "process"

export function getSecret() {
    return env['REGISTRATION_SECRET']
}