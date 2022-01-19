export type CursorMessage = {
    id: string;
    x: number;
    y: number;
    name?: string;
    avatar?: string;
};

export type MovementMessage = {
    id: string;
    x: number;
    y: number;
};

export type TextMessage = {
    id: string;
    message: string;
};

export type OfflineMessage = {
    id: string;
};

export type MousePosition = {
    mouseX: number;
    mouseY: number;
};

export type Latency = {
    id: string;
    meshId: string;
    latency: number;
};
