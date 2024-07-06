// components/SketchControls.tsx
import React, { FormEvent, ReactNode } from 'react';
import styled from 'styled-components';
import { SketchControlsProps } from '../types/sketchCanvas'

const ControlsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    border-top: 1px solid #ccc;
`;

const Button = styled.button<{
    onClick: (e: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
}>`
    padding: 5px 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #e0e0e0;
    }
`;

const SketchControls: React.FC<SketchControlsProps> = ({
                                                           eraseMode,
                                                           toggleEraseMode,
                                                           clearCanvas,
                                                           undo,
                                                           redo,
                                                           exportImage
                                                       }) => {
    return (
        <ControlsWrapper>
            <Button onClick={() => {
                toggleEraseMode();
            }}>
                {eraseMode ? 'Draw' : 'Erase'}
            </Button>
            <Button onClick={clearCanvas}>Clear</Button>
            <Button onClick={undo}>Undo</Button>
            <Button onClick={redo}>Redo</Button>
            <Button onClick={exportImage}>Export</Button>
        </ControlsWrapper>
    );
};

export default SketchControls;