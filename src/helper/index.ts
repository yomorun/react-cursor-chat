export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const getViewportSize = () => {
    if ((window as any).getViewportSize) {
        return (window as any).getViewportSize;
    }

    window.onresize = () => {
        (window as any).getViewportSize = {
            width:
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth,
            height:
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight,
        };
    };

    (window as any).onresize();

    return (window as any).getViewportSize;
};

export const getScale = (x: number, y: number) => {
    const { width, height } = getViewportSize();
    return {
        scaleX: x / width,
        scaleY: y / height,
    };
};

export const getMousePosition = (scaleX: number, scaleY: number) => {
    const { width, height } = getViewportSize();
    return {
        mouseX: scaleX * width,
        mouseY: scaleY * height,
    };
};

export const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xff;
        color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
};
