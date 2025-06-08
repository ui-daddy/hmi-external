export const isIosDevice = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}