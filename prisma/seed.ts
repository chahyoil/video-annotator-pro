import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

/// npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts

async function main() {

    // 기존 데이터 삭제
    await prisma.annotation.deleteMany();
    await prisma.video.deleteMany();
    await prisma.user.deleteMany();

    // 더미 유저 생성
    const users = await Promise.all(
        Array.from({ length: 5 }).map(async (_, i) => {
            const hashedPassword = await hash('password123', 10)
            return prisma.user.create({
                data: {
                    email: `user${i + 1}@example.com`,
                    name: `User ${i + 1}`,
                    password: hashedPassword,
                },
            })
        })
    )

    console.log('Created 5 dummy users')

    // 더미 비디오 생성
    const videos = await Promise.all(
        Array.from({ length: 2 }).map((_, i) => {
            const useLocalFile = true; // 전부 로컬 비디오 데이터
            return prisma.video.create({
                data: {
                    title: `Video ${i + 1}`,
                    url: useLocalFile ? '' : `https://example.com/video${i + 1}.mp4`,
                    filename: useLocalFile ? `video${i + 1}.mp4` : null,
                    duration: Math.floor(Math.random() * 600) + 60,
                    userId: users[Math.floor(Math.random() * users.length)].id,
                },
            })
        })
    )

    console.log('Created 10 dummy videos')

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })