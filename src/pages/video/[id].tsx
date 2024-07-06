// pages/video/[id].tsx
import { GetServerSideProps } from 'next'
import {FormEvent, ReactNode, useState, useEffect, useRef, useCallback} from 'react'
import styled from 'styled-components'
import prisma from '@utils/db'
import { Video, Annotation } from '../../types'
import VideoPlayer from '@components/VideoPlayer'
import AnnotationTool from '@components/AnnotationTool'
import { useAnnotation } from '@hooks/useAnnotation'
import SketchControls from '@components/SketchControls';

import SketchCanvas from '@components/SketchCanvas';
import {SketchCanvasRef} from "../../types/sketchCanvas";
import Layout from "@components/Layout";
import ReactPlayer from "react-player";
import getTimeGroup from "@utils/getTimeGroup";
import { saveCanvasStateStorage, getCanvasStateStorage } from '@utils/localStorage';
import comparePathsWithTolerance from "@utils/compare";

const PageContainer = styled.div`
    display: flex;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    height: 90vh;
`;

const PageHeader = styled.h2`
    display : flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #eaeaea;
`;

const ContentContainer = styled.div`
    flex: 4; // 75%
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const VideoWrapper = styled.div<{
    isFullScreen: boolean;
    children: ReactNode;
}>`
    width: 100%;
    height: 95%;
    position: relative;
    z-index: ${props => props.isFullScreen ? 0 : 1};
`;

const SketchCanvasWrapper = styled.div<{
    isFullScreen: boolean;
    children: ReactNode;
}>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: ${props => props.isFullScreen ? 'auto' : 'none'};
    z-index: ${props => props.isFullScreen ? 1000 : 1};
    opacity: ${props => props.isFullScreen ? 1 : 0}; // 그리기 모드가 아닐 때 투명하게
`;

const AnnotationContainer = styled.div`
    flex: 1; // 25%
    display: flex;
    flex-direction: column;
    padding: 10px;
`;


const AnnotationSection = styled.div`
    flex: 1;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto; // 내용이 많을 경우 스크롤 가능하도록 설정
`;

const ControlsContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 1001; // SketchCanvas와 Overlay보다 위에 위치
`;

const SketchControlsWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const ControlsToggle = styled.button<{
  onClick: () => void;
  children: ReactNode;
}>`
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

interface VideoPageProps {
    video: Video
    initialAnnotations: Annotation[]
    videos: { id: number; title: string }[]
    showSidebar: boolean
}


export default function VideoPage({ video, initialAnnotations, videos }: VideoPageProps) {
    const [currentTime, setCurrentTime] = useState(0)
    const [eraseMode, setEraseMode] = useState(false)
    const [controlsVisible, setControlsVisible] = useState(false)

    const [isFullScreenCanvas, setIsFullScreenCanvas] = useState(false);
    const [canvasStates, setCanvasStates] = useState<{ [time: number]: string }>({});

    const sketchCanvasRef = useRef<SketchCanvasRef>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const videoPlayerRef = useRef<ReactPlayer>(null);

    const {
        annotations,
        isLoading,
        error,
        addAnnotation,
        editAnnotation,
        removeAnnotation
    } = useAnnotation(video.id, initialAnnotations);

    const handleSaveDrawing = useCallback((paths: string) => {
        addAnnotation(undefined, currentTime, paths);
    }, [addAnnotation, currentTime]);

    const toggleEraseMode = () => {
        setEraseMode(prev => !prev);
        sketchCanvasRef.current?.toggleEraseMode();
    };

    const clearCanvas = () => {
        sketchCanvasRef.current?.clearCanvas();
        console.log('Clearing canvas');
    };

    const undo = () => {
        sketchCanvasRef.current?.undo();
        console.log('Undoing');
    };

    const redo = () => {
        sketchCanvasRef.current?.redo();
        console.log('Redoing');
    };

    const exportImage = () => {
        sketchCanvasRef.current?.exportImage().then(data => {
            console.log('Exporting image', data);
        });
    };

    const toggleFullScreenCanvas = async () => {
        if (isFullScreenCanvas) {
            // 그림판 모드에서 나갈 때
            const paths = await sketchCanvasRef.current?.exportPaths();
            if (paths) {
                const timeGroup = getTimeGroup(currentTime);
                const pathsString = JSON.stringify(paths);
                const previousPaths = getCanvasStateStorage(video.id, timeGroup);

                const shouldSave = comparePathsWithTolerance(pathsString, previousPaths);

                if (shouldSave) {
                    if (confirm("변경사항이 있습니다. 저장하시겠습니까?")) {
                        saveCanvasStateStorage(video.id, timeGroup, pathsString);
                    }
                }
            }
        } else {
            // 그림판 모드로 들어갈 때
            if (isPlaying) {
                videoPlayerRef.current?.getInternalPlayer().pause();
                setIsPlaying(false);
            }
            const timeGroup = getTimeGroup(currentTime);
            const savedPaths = getCanvasStateStorage(video.id, timeGroup);
            const parsedPaths = JSON.parse(savedPaths || '[]');

            sketchCanvasRef.current?.loadPaths(parsedPaths);
        }

        setIsFullScreenCanvas(prev => !prev);
        setControlsVisible(prev => !prev);
    };

    const handleTimeUpdate = (time: number) => {
        setCurrentTime(time);
        setIsPlaying(true);
    };

    const handlePlayPause = (playing: boolean) => {
        setIsPlaying(playing);
    };

    useEffect(() => {
        if (isFullScreenCanvas) {
            const timeGroup = getTimeGroup(currentTime);
            const savedPaths = getCanvasStateStorage(video.id, timeGroup);
            const parsedPaths = JSON.parse(savedPaths);
            sketchCanvasRef.current?.loadPaths(parsedPaths);
        }
    }, [isFullScreenCanvas, currentTime, video.id]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullScreenCanvas) {
                toggleFullScreenCanvas();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isFullScreenCanvas]);

    useEffect(() => {
        const timeGroup = getTimeGroup(currentTime);
        if (canvasStates[timeGroup]) {
            console.log('canvasStates[timeGroup]', canvasStates[timeGroup]);
            sketchCanvasRef.current?.loadPaths(JSON.parse(canvasStates[timeGroup]));
        } else {
            sketchCanvasRef.current?.clearCanvas();
        }
    }, [currentTime, canvasStates]);


    return (
        <PageContainer>

            <ContentContainer>
                <VideoWrapper isFullScreen={isFullScreenCanvas}>
                    <VideoPlayer
                        src={video.url}
                        filename={video.filename}
                        onTimeUpdate={handleTimeUpdate}
                    />
                </VideoWrapper>

                <SketchCanvasWrapper isFullScreen={isFullScreenCanvas}>
                    <SketchCanvas
                        ref={sketchCanvasRef}
                        width="100%"
                        height="100%"
                        eraseMode={eraseMode}
                        isFullScreen={isFullScreenCanvas}
                        onSave={handleSaveDrawing}
                    />
                </SketchCanvasWrapper>

            </ContentContainer>

            <AnnotationContainer>
                <AnnotationSection>
                    <h2>Annotations</h2>
                    <AnnotationTool
                        annotations={annotations}
                        currentTime={currentTime}
                        onAddAnnotation={(content) => addAnnotation(content, currentTime)}
                        onEditAnnotation={(id, content) => editAnnotation(id, {type: 'text', content, timestamp: currentTime })}
                        onRemoveAnnotation={removeAnnotation}
                        isLoading={isLoading}
                    />
                    {error && <p>Error loading annotations: {error.message}</p>}
                </AnnotationSection>
            </AnnotationContainer>

            <ControlsContainer>
                <SketchControlsWrapper>
                    <SketchControls
                        eraseMode={eraseMode}
                        toggleEraseMode={toggleEraseMode}
                        clearCanvas={clearCanvas}
                        undo={undo}
                        redo={redo}
                        exportImage={exportImage}
                    />
                </SketchControlsWrapper>
                <ControlsToggle onClick={toggleFullScreenCanvas}>
                    {isFullScreenCanvas ? 'Exit Full Screen' : 'Enter Full Screen'}
                </ControlsToggle>
            </ControlsContainer>
        </PageContainer>
    );

}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const videoId = Number(context.params?.id)
    const video = await prisma.video.findUnique({ where: { id: videoId } })
    const annotations = await prisma.annotation.findMany({ where: { videoId } })
    const videos = await prisma.video.findMany({ select: { id: true, title: true } })

    if (!video) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            video: JSON.parse(JSON.stringify(video)),
            initialAnnotations: JSON.parse(JSON.stringify(annotations)),
            videos: JSON.parse(JSON.stringify(videos)),
            showSidebar: true, // 비디오 페이지에서는 사이드바를 표시
        },
    }
}