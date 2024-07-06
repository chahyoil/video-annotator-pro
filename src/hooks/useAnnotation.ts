import { useState, useCallback } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import {Annotation, AnnotationType, CreateAnnotationDto, UpdateAnnotationDto} from '../types';
import { getAnnotationsForVideo, createAnnotation, updateAnnotation, deleteAnnotation } from '@utils/api';
import axios from "axios";

const DUMMY_USER_ID = 3;

export function useAnnotation(videoId: number, initialAnnotations: Annotation[]) {
    const [isLoading, setIsLoading] = useState(false);

    const swrConfig: SWRConfiguration = {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 0,
        fallbackData: initialAnnotations,
    };

    const { data: annotations, error, mutate } = useSWR<Annotation[]>(
        videoId ? [`/api/videos/${videoId}/annotations`, videoId] : null,
        () => getAnnotationsForVideo(videoId).catch(error => {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return []; // 404 에러 시 빈 배열 반환
            }
            throw error;
        }),
        swrConfig
    );

    const addAnnotation = useCallback(async (content: string | undefined, timestamp: number, paths?: string) => {

        setIsLoading(true);
        try {

            const type : AnnotationType = content ? 'text' : 'drawing';

            const newAnnotation: CreateAnnotationDto = {
                content,
                paths,
                timestamp,
                videoId,
                userId: DUMMY_USER_ID,
                type: type
            };

            console.log(`Creating annotation:`, newAnnotation);

            const createdAnnotation = await createAnnotation(newAnnotation);

            console.log(`Created annotation:`, createdAnnotation);

            await mutate([...(annotations || []), createdAnnotation], false);
        } catch (error) {
            const err = error as Error;
            console.error('Failed to add annotation:', err.message);
        } finally {
            setIsLoading(false);
        }
    }, [videoId, annotations, mutate]);

    const editAnnotation = useCallback(async (id: number, updatedData: UpdateAnnotationDto) => {
        setIsLoading(true);
        try {

            const updatedAnnotation = await updateAnnotation(id, updatedData);

            await mutate(
                annotations?.map(ann => ann.id === id ? updatedAnnotation : ann),
                false
            );
        } catch (error) {
            console.error('Failed to edit annotation:', error);
            // Here you might want to show an error message to the user
        } finally {
            setIsLoading(false);
        }
    }, [annotations, mutate]);

    const removeAnnotation = useCallback(async (id: number) => {
        setIsLoading(true);
        try {

            await deleteAnnotation(id);

            await mutate(annotations?.filter(ann => ann.id !== id), false);
        } catch (error) {
            console.error('Failed to remove annotation:', error);
            // Here you might want to show an error message to the user
        } finally {
            setIsLoading(false);
        }
    }, [annotations, mutate]);

    return {
        annotations: annotations || initialAnnotations,
        isLoading,
        error,
        addAnnotation,
        editAnnotation,
        removeAnnotation,
    };
}