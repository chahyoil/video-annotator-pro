// src/utils/api.ts
import axios from 'axios'
import {Annotation, ApiResponse, CreateAnnotationDto, PaginatedResponse, UpdateAnnotationDto, Video} from '../types'
import {handleError} from "../types/errors";

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export async function getVideos(page = 1, limit = 10): Promise<PaginatedResponse<Video>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Video>>>(`/videos?page=${page}&limit=${limit}`)
    return response.data.data
}

export async function getVideo(id: number): Promise<Video> {
    const response = await api.get<ApiResponse<Video>>(`/videos/${id}`)
    return response.data.data
}

export async function createAnnotation(data: CreateAnnotationDto): Promise<Annotation> {
    try {
        const response = await api.post<ApiResponse<Annotation>>('/annotations', data);
        return response.data.data;
    } catch (error) {
        console.error('API error:', handleError(error));
        throw error;
    }
}

export async function updateAnnotation(id: number, data: UpdateAnnotationDto): Promise<Annotation> {
    try {
        console.log(`Updating annotation ${id} with data:`, data);
        const response = await api.put<ApiResponse<Annotation>>(`/annotations/${id}`, data);
        console.log(`Update response:`, response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error updating annotation:', handleError(error));
        throw error;
    }
}


export async function deleteAnnotation(id: number): Promise<void> {
    try {
        console.log(`Deleting annotation ${id}`);
        await api.delete(`/annotations/${id}`);
        console.log(`Annotation ${id} deleted successfully`);
    } catch (error) {

        console.error('Error deleting annotation:',  handleError(error));
        throw error;
    }
}

export async function getAnnotationsForVideo(videoId: number): Promise<Annotation[]> {
    try {
        const response = await api.get<ApiResponse<Annotation[]>>(`/annotations?videoId=${videoId}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log(`No annotations found for video ${videoId}`);
            return [];
        }
        throw error;
    }
}