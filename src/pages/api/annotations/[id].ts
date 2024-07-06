import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@utils/db';
import { UpdateAnnotationDto , AnnotationType} from '../../../types';
import {handleError, isApiError} from "../../../types/errors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'PUT':
            return handlePut(req, res, Number(id));
        case 'DELETE':
            return handleDelete(req, res, Number(id));
        default:
            res.setHeader('Allow', ['PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, id: number) {
    const data: UpdateAnnotationDto = req.body;

    const updateData = {
        ...(data.paths !== undefined && { paths: data.paths }),
        ...(data.timestamp !== undefined && { timestamp: data.timestamp }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.type !== undefined && { type: data.type }),
    };


    try {
        console.log(`Updating annotation ${id} with data:`, data);
        const annotation = await prisma.annotation.update({
            where: { id: id },
            data: updateData,
            include: { user: true },
        });
        console.log('Updated annotation:', annotation);
        res.status(200).json({ data: annotation });
    } catch (error) {
        console.error('Failed to update annotation:', error);
        if (isApiError(error) && error.response?.data?.code === 'P2025') {
            res.status(404).json({ error: 'Annotation not found' });
        } else {
            res.status(500).json({ error: handleError(error) });
        }
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: number) {
    try {
        console.log(`Deleting annotation ${id}`);
        await prisma.annotation.delete({
            where: { id: id },
        });
        console.log(`Annotation ${id} deleted successfully`);
        res.status(204).end();
    } catch (error) {
        console.error('Failed to delete annotation:', error);
        if (isApiError(error) && error.response?.data?.code === 'P2025') {
            res.status(404).json({ error: 'Annotation not found' });
        } else {
            res.status(500).json({ error: handleError(error) });
        }
    }
}