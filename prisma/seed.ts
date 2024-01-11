import { PrismaClient } from "@prisma/client";


//Resetting the auto increment values wasn't straightforward, since they're not created automatically as identity columns in postgres

async function clearExistingValues(prisma: PrismaClient) {
    await prisma.review.deleteMany({})
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('public."Review"', 'id'), 1)`;
    await prisma.movie.deleteMany({})
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('public."Movie"', 'id'), 1)`;

    await prisma.user.deleteMany({})
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('public."User"', 'id'), 1)`;
}


async function main(){
    const  prisma = new PrismaClient();

    try {
        console.log('executing the seed script...')
        await clearExistingValues(prisma)

        const users = await prisma.user.createMany({
            data: [
                {clerkId: 'fake-1', email: 'antero@gmail.com'},
                {clerkId: 'fake-2', email: 'bepis@gmail.com'},
                {clerkId: 'fake-3', email: 'celebrimbor@gmail.com'}
            ]
        })



        const movies = await prisma.movie.createMany({
            data: [
                {title: 'The Fellowship of the Ring', year: 2001, description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.', userId: 2},
                {title: 'The Matrix', year: 1999, description: 'It is a great movie', userId: 2},
                {title: 'The Two Towers', year: 2002, description: 'What a fantasy experience', userId: 3},
                {title: 'The Return of the King', year: 2003, description: 'The best of the trilogy', userId: 3},
            ]
        })



        const reviews = await prisma.review.createMany({
            data: [
                {
                    score: "FIFTEEN",
                    movieId: 2,
                    userId: 2
                },
                {
                    score: "SEVENTEEN",
                    movieId: 2,
                    userId: 4
                },
                {
                    score: "THREE",
                    movieId: 3,
                    userId: 2
                }
            ]
        })
        
        console.log('seed script executed!')
    } catch(e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect();
    }

}

main();