export type AnnotationType = 'text' | 'drawing';

export interface User {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string | null;
}

export interface Video {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    url: string;
    duration: number;
    userId: number;
    filename?: string | null;
    user?: User;
    annotations?: Annotation[];
}

export interface Annotation {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    content?: string;
    timestamp: number;
    videoId: number;
    userId: number;
    video?: Video;
    user?: User;
    paths?: string; // JSON 문자열로 저장된 paths
    type: AnnotationType; // 주석 타입을 구분하기 위한 필드
}

export interface CreateVideoDto {
    title: string;
    url: string;
    duration: number;
    userId: number;
    filename?: string | null;
}

export interface CreateAnnotationDto {
    content?: string;
    paths?: string;
    timestamp: number;
    videoId: number;
    userId: number;
    type: AnnotationType;
}

export interface UpdateAnnotationDto {
    content?: string;
    timestamp?: number;
    paths?: string;
    type: AnnotationType;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}