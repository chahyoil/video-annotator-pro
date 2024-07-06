import { GetServerSideProps } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import prisma from '@utils/db'
import { Video } from '../types'

const VideoList = styled.ul`
  list-style: none;
  padding: 0;
`

const VideoItem = styled.li<{ children?: React.ReactNode }>`
    margin-bottom: 1rem;
`;

interface HomeProps {
    videos: { id: number; title: string }[]
    showSidebar: boolean
}

export default function Home({ videos }: HomeProps) {

    return (
        <VideoList>
            {videos.map((video) => (
                <VideoItem key={video.id}>
                    <Link href={`/video/${video.id}`}>
                        {video.title}
                    </Link>
                </VideoItem>
            ))}
        </VideoList>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const videos = await prisma.video.findMany({ select: { id: true, title: true } })

    return {
        props: {
            videos: JSON.parse(JSON.stringify(videos)),
            showSidebar: false,
        },
    }
}