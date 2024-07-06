import React from 'react';
import styled from 'styled-components';
import Sidebar from "@components/SideBar";

const LayoutWrapper = styled.div`
    display: flex;
    min-height: 100vh;
`;

const MainContent = styled.main<{
    hasSidebar: boolean;
    children: React.ReactNode;
}>`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: ${props => props.hasSidebar ? '200px' : '0'};
`;

const Header = styled.header`
    padding: 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

interface LayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
    videos?: { id: number; title: string }[];
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false, videos = [] }) => {
    return (
        <LayoutWrapper>
            {showSidebar && <Sidebar videos={videos} />}
            <MainContent hasSidebar={showSidebar}>
                <Header>
                    <h1>Video Annotation Service</h1>
                </Header>
                <Content>{children}</Content>
            </MainContent>
        </LayoutWrapper>
    );
};

export default Layout;