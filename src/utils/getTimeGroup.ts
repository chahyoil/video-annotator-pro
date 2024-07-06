const getTimeGroup = (time: number): number => {
    return Math.floor(time / 3) * 3;
};

export default getTimeGroup