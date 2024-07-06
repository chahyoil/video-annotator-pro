// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const SidebarContainer = styled.div`
    width: 200px;
    height: 100%;
    background-color: #f0f0f0;
    padding: 20px;
    overflow-y: auto;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
`;

const SidebarButton = styled.button`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
`;

interface SidebarProps {
    videos: { id: number; title: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ videos }) => {
    return (
        <SidebarContainer>
            <Link href="/">
                <SidebarButton>Back to Home</SidebarButton>
            </Link>
            {videos.map((video) => (
                <Link href={`/video/${video.id}`} key={video.id}>
                    <SidebarButton>{video.title}</SidebarButton>
                </Link>
            ))}
        </SidebarContainer>
    );
};

export default Sidebar;