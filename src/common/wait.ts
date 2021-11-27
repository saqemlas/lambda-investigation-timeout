function wait(ms: number, resolve?: any): Promise<ReturnType<typeof setTimeout>> {
    return new Promise(() => {
        setTimeout(resolve, ms);
    });
};

export default wait;
