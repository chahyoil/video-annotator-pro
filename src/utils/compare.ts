const comparePathsWithTolerance = (newPaths: string, oldPaths: string): boolean => {
    const newLength = newPaths.length;
    const oldLength = oldPaths.length;

    // console.log('newLength:', newLength, 'oldLength:', oldLength);

    // 길이가 정확히 같으면 변경사항 없음
    if (newLength === oldLength) {
        return false;
    }

    // 길이 차이가 .5% 이상일 때만 변경사항 있음으로 판단
    const lengthDifference = Math.abs(newLength - oldLength);
    const tolerance = Math.max(newLength, oldLength) * 0.005;

    return lengthDifference > tolerance;
};

export default comparePathsWithTolerance;