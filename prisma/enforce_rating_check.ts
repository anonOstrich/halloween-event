
const {PrismaClient} = require('@prisma/client')



async function fillCheckTable (){
    const prisma = new PrismaClient();
    try {
        const existingRows = await prisma.reviewScoreValue.count();
        if (existingRows > 0) {
            console.log('There are already rows in the reviewScoreValue table. Exiting...')
            return;
        }
        const values = Array.from({length: 20}, (_, idx) => idx).map(v => ({id: v}))
        const createdValues = await prisma.reviewScoreValue.createMany({
            data: values
        })
        console.log('Created nof values: ', createdValues.count)
    } catch(e) {
        console.error(e)
        process.exit(1)
    } finally {
        prisma.$disconnect()
    }
}




fillCheckTable();