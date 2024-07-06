// components/SketchCanvas.tsx
import React, {useRef, useImperativeHandle, forwardRef, useEffect, useState} from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import styled from 'styled-components';
import { SketchCanvasRef, SketchCanvasProps } from '../types/sketchCanvas';

const CanvasWrapper = styled.div<{
    isFullScreen: boolean;
    children: React.ReactNode;
}>`
    width: ${props => props.isFullScreen ? '100vw' : '100%'};
    height: ${props => props.isFullScreen ? 'calc(100vh - 60px)' : '100%'}; // 하단에 60px 공간 확보
    position: ${props => props.isFullScreen ? 'fixed' : 'relative'};
    top: 0;
    left: 0;
    z-index: ${props => props.isFullScreen ? 1000 : 1};
    pointer-events: ${props => props.isFullScreen ? 'auto' : 'none'};
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100vh - 60px); // 하단에 60px 공간 확보
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 999;
`;

const SketchCanvas = forwardRef<SketchCanvasRef, SketchCanvasProps>(
    ({ width = '90%', height = '400px', eraseMode, isFullScreen, onSave  }, ref) => {
        const canvasRef = useRef<ReactSketchCanvasRef>(null);
        const [paths, setPaths] = useState<any[]>([]);

        useEffect(() => {
            canvasRef.current?.eraseMode(eraseMode);
        }, [eraseMode]);

        useImperativeHandle(ref, () => ({
            toggleEraseMode: () => {
                canvasRef.current?.eraseMode(eraseMode);
            },
            clearCanvas: () => {
                canvasRef.current?.clearCanvas();
                setPaths([]);
            },
            undo: () => {
                canvasRef.current?.undo();
            },
            redo: () => {
                canvasRef.current?.redo();
            },
            exportImage: () => {
                return canvasRef.current?.exportImage('png') || Promise.resolve('');
            },
            loadPaths: (newPaths: any[]) => {
                canvasRef.current?.clearCanvas(); // 기존 paths 삭제
                setPaths(newPaths);
                canvasRef.current?.loadPaths(newPaths);
            },
            exportPaths: async () => {
                const paths = await canvasRef.current?.exportPaths();
                if (paths && onSave) {
                    onSave(JSON.stringify(paths));
                }
                return paths;
            }
        }));

        return (
            <>
                {isFullScreen && <Overlay />}
                <CanvasWrapper isFullScreen={isFullScreen}>
                    <ReactSketchCanvas
                        ref={canvasRef}
                        width={isFullScreen ? '100vw' : width}
                        height={isFullScreen ? '100vh' : height}
                        strokeWidth={4}
                        strokeColor={eraseMode ? "white" : "black"}
                        canvasColor="transparent"
                        onChange={(updatedPaths) => setPaths(updatedPaths)}
                    />
                </CanvasWrapper>
            </>
        );
    }
);

SketchCanvas.displayName = 'SketchCanvas';

export default SketchCanvas;