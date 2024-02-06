import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

let id = 1;
async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: id++,
        userId: nanoid(12),
        email: 'noah071610@gmail.com',
        userImage: 'https://avatars.githubusercontent.com/u/74864925?v=4',
        userName: '노아쨩',
      },
    ],
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  throw error;
});
