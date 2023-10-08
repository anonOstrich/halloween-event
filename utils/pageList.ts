export type Page = {
    url: string,
    title: string
}
export const pages: Array<Page> = [
    {url: '/', title: 'home'},
    {url: '/movies', title: 'movies'},
    {url: '/newsletter', title: 'newsletter'},
    {url: '/sign-in', title: 'sign in'},
    {url: '/sign-up', title: 'sign up'}
]