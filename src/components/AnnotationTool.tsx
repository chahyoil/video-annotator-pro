import React, {useState, FormEvent, ReactNode} from 'react';
import styled from 'styled-components';
import { Annotation } from '../types';

const AnnotationWrapper = styled.div`
    margin-top: 20px;
`;

const AnnotationList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const AnnotationItem = styled.li<{ children?: React.ReactNode }>`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #eaeaea;
    border-radius: 4px;
`;

const AnnotationForm = styled.form<{
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
}>`
    display: flex;
    margin-top: 20px;
`;

const AnnotationInput = styled.input.attrs({
    type: 'text',
})<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }>`
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #eaeaea;
    border-radius: 4px;
`;

const AnnotationButton = styled.button.attrs({ type: 'submit' })<{
    children: ReactNode;
}>`
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #0070f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

interface AnnotationToolProps {
    annotations: Annotation[] | undefined; // undefined를 허용
    currentTime: number;
    onAddAnnotation: (content: string) => void;
    onEditAnnotation: (id: number, updatedData: string | undefined) => void;
    onRemoveAnnotation: (id: number) => void;
    isLoading: boolean;
}

// handleSubmit 함수의 타입 정의
type HandleSubmitType = (e: FormEvent<HTMLFormElement>) => void;

const AnnotationTool: React.FC<AnnotationToolProps> = ({
                                                           annotations,
                                                           currentTime,
                                                           onAddAnnotation,
                                                           onEditAnnotation,
                                                           onRemoveAnnotation,
                                                            isLoading
                                                       }) => {
    const [newAnnotation, setNewAnnotation] = useState('');

    const handleSubmit: HandleSubmitType = (e) => {
        e.preventDefault();
        if (newAnnotation.trim()) {
            onAddAnnotation(newAnnotation);
            setNewAnnotation('');
        }
    };

    return (
        <AnnotationWrapper>
            <AnnotationList>
                {annotations && annotations.map((annotation) => (
                    <AnnotationItem key={annotation.id}>
                        <strong>{annotation.timestamp.toFixed(2)}s:</strong> {annotation.content}
                        <button onClick={() => onEditAnnotation(annotation.id, annotation.content)}>Edit</button>
                        <button onClick={() => onRemoveAnnotation(annotation.id)}>Delete</button>
                    </AnnotationItem>
                ))}
            </AnnotationList>
            <AnnotationForm onSubmit={handleSubmit}>
                <AnnotationInput
                    value={newAnnotation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAnnotation(e.target.value)}
                    placeholder="Add a new annotation..."
                />
                <AnnotationButton type="submit">Add</AnnotationButton>
            </AnnotationForm>
        </AnnotationWrapper>
    );
};

export default AnnotationTool;