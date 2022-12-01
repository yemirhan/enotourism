import { PrismaClient } from '@prisma/client'
import { countries } from './countries'
const prisma = new PrismaClient()
async function main() {
  await prisma.country.createMany({
    data: countries
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })