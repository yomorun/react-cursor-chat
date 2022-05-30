import Presence from '@yomo/presencejs';
import { Latency, MousePosition } from '../types';

export default class Cursor {
    public id: string;
    public x: number;
    public y: number;
    public name: string;
    public avatar: string;
    public color: string;

    constructor(
        id: string,
        x: number,
        y: number,
        name: string,
        avatar: string,
        color: string
    ) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
        this.avatar = avatar;
        this.color = color;
    }

    move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    onMove(_mousePosition: MousePosition) {}

    onGetLatency(_data: Latency) {}

    subscribeLatency(yomo: Presence) {
        return yomo.on$<Latency>('latency').subscribe(data => {
            if (data.id !== this.id) {
                return;
            }
            this.onGetLatency(data);
        });
    }
}
