// types/sketchCanvas.ts
export interface SketchCanvasRef {
    toggleEraseMode: () => void;
    clearCanvas: () => void;
    undo: () => void;
    redo: () => void;
    exportImage: () => Promise<string>;
    loadPaths: (paths: any) => void;
    exportPaths: () => Promise<any>;
}

export interface SketchCanvasProps {
    width?: string;
    height?: string;
    eraseMode: boolean;
    isFullScreen: boolean;
    onSave?: (paths: string) => void;
}

export interface SketchControlsProps {
    eraseMode: boolean;
    toggleEraseMode: () => void;
    clearCanvas: () => void;
    undo: () => void;
    redo: () => void;
    exportImage: () => void;
}