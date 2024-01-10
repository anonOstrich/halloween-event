import { Score } from "@prisma/client";

const scoresByNames= {
    "ZERO": 0,
    "ONE": 1,
    "TWO": 2,
    "THREE": 3,
    "FOUR": 4,
    "FIVE": 5,
    "SIX": 6,
    "SEVEN": 7,
    "EIGHT": 8,
    "NINE": 9,
    "TEN": 10,
    "ELEVEN": 11,
    "TWELVE": 12,
    "THIRTEEN": 13,
    "FOURTEEN": 14,
    "FIFTEEN": 15,
    "SIXTEEN": 16,
    "SEVENTEEN": 17,
    "EIGHTEEN": 18,
    "NINETEEN": 19
}

const namesByScores: {[n: number]: Score} = Object.entries(scoresByNames).reduce((acc: {[k: number]: Score}, el) => {
    acc[el[1]] = el[0] as Score
    return acc
}, {})

export function convertNumberToScore(n: number){
    if (n in namesByScores) {
        return namesByScores[n]
    }
    throw new Error(`Cannot convert ${n} into a Score enum`)
}

export function convertScoreToNumber(s: Score) {
    if (s in scoresByNames) {
        return scoresByNames[s]
    }
    throw new Error(`Cannot convert Score enum ${s} into a numerical score`)
}