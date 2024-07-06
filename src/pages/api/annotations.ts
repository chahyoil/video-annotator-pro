import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@utils/db';
import { CreateAnnotationDto, UpdateAnnotationDto, AnnotationType  } from '../../types';
import { Prisma } from '@prisma/client';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

// GET /api/annotations
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
    }

    try {
        const annotations = await prisma.annotation.findMany({
            where: { videoId: Number(videoId) },
            include: { user: true },
        });
        res.status(200).json({ data: annotations });
    } catch (error) {
        console.error('Failed to fetch annotations:', error);
        res.status(500).json({ error: 'Failed to fetch annotations' });
    }
}

// POST /api/annotations
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const data: CreateAnnotationDto = req.body;

    // const users = await prisma.user.findMany();
    // console.log('Users:', users);

    // User와 Video가 존재하는지 먼저 확인
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    const video = await prisma.video.findUnique({ where: { id: data.videoId } });

    if (!user || !video) {
        return res.status(404).json({ error: 'User or Video not found' });
    }

    try {

        const annotationData: Prisma.AnnotationCreateInput = {
            timestamp: data.timestamp,
            video: { connect: { id: data.videoId } },
            user: { connect: { id: data.userId } },
            type: data.content ? 'text' : 'drawing', // content가 있으면 'text', 없으면 'drawing'
            ...(data.content && { content: data.content }),
            ...(data.paths && { paths: data.paths }),
        };

        console.log(`Creating annotation with data:`, annotationData);

        const annotation = await prisma.annotation.create({
            data: annotationData,
            include: { user: true, video: true },
        });
        console.log('Created annotation:', annotation);
        return res.status(201).json({ data: annotation });  // 'data' 프로퍼티 안에 넣어 반환
    } catch (error) {
        const err = error as Error;
        console.error('Failed to create annotation:', error);
        return res.status(500).json({ error: 'Failed to create annotation', details: err.message });
    }

}
