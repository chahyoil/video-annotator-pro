import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@utils/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (req.method === 'GET') {
        try {
            const annotations = await prisma.annotation.findMany({
                where: { videoId: Number(id) },
            })
            res.status(200).json(annotations)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching annotations' })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}