export const getEllipsis = (text: string, length: number): string => {
    if (!length) {
        return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text) ? (text.length > 8 ? text.substring(0, 8).concat('...') : text)
        : (text.length > 15 ? text.substring(0, 15).concat('...') : text);
    }
    return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text) ? (text.length > length / 2 ? text.substring(0, length / 2).concat('...') : text)
    : (text.length > length ? text.substring(0, length).concat('...') : text);
};
