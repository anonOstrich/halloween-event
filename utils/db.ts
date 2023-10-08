import { readFile, writeFile } from "fs/promises";
import {resolve} from 'path'

export async function getDBContents(): Promise<{
    halloweenSecret: string
}> {
   
    const contents = await readFile('json/data.json', 'utf-8')
    console.log(contents)
    return JSON.parse(contents)
}   


export async function setSecret(secret: string): Promise<void> {
    const contents = JSON.stringify({halloweenSecret: secret}, null, 2)
    await writeFile('json/data.json', contents, 'utf-8')
}