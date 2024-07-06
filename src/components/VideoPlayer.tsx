import React, {useRef, useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const VideoWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

interface VideoPlayerProps {
    src: string;
    filename?: string | null;
    onTimeUpdate?: (currentTime: number) => void;
    onPlayPause?: (isPlaying: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, filename, onTimeUpdate, onPlayPause  }) => {
    const playerRef = useRef<ReactPlayer>(null);
    const videoSource = filename ? `/videos/${filename}` : src;
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) {
        return null; // 또는 로딩 상태를 표시
    }

    const handleProgress = (state: { playedSeconds: number }) => {
        if (onTimeUpdate) {
            onTimeUpdate(state.playedSeconds);
        }
    };



    const handlePlayPause = (playing: boolean) => {
        if (onPlayPause) {
            onPlayPause(playing);
        }
    };

    return (
        <VideoWrapper>
            <ReactPlayer
                ref={playerRef}
                url={videoSource}
                width="100%"
                height="100%"
                controls={true}
                onProgress={handleProgress}
                onPlay={() => handlePlayPause(true)}
                onPause={() => handlePlayPause(false)}
                progressInterval={1000}
                onError={(e) => console.error('ReactPlayer error:', e)}
                onReady={() => console.log('Video is ready')}
                config={{
                    file: {
                        attributes: {
                            preload: 'auto'
                        }
                    }
                }}
            />
        </VideoWrapper>
    );
};

export default VideoPlayer;