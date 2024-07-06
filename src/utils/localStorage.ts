import comparePathsWithTolerance from "@utils/compare";

export const saveCanvasStateStorage = (videoId: number, time: number, pathsString: string) => {
    const key = `video_${videoId}_canvas`;
    const storedStates = JSON.parse(localStorage.getItem(key) || '{}');

    // 이전 상태와 새로운 상태를 비교
    if (comparePathsWithTolerance(pathsString, storedStates[time] || '[]')) {
        storedStates[time] = pathsString;
        try {
            localStorage.setItem(key, JSON.stringify(storedStates));
        } catch (e) {
            console.error('로컬 스토리지 저장 중 오류 발생:', e);
        }
    }
};

export const getCanvasStateStorage = (videoId: number, time: number) => {
    const key = `video_${videoId}_canvas`;
    const storedStates = JSON.parse(localStorage.getItem(key) || '{}');
    return storedStates[time] || '[]';
};