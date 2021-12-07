import { YoMoClient } from 'yomo-js';
import Cursor from '.';
import { getMousePosition } from '../helper';
import { MessageContent } from '../types';

export default class Mate extends Cursor {
    constructor({
        id,
        x,
        y,
        name = '',
        avatar = '',
    }: {
        id: string;
        x: number;
        y: number;
        name?: string;
        avatar?: string;
    }) {
        super(id, x, y, name, avatar);
    }

    goOnline(yomoclient: YoMoClient<MessageContent>) {
        this.movement(yomoclient);
        this.subscribeMessage(yomoclient);
    }

    onMessage(_message: string) {}

    private subscribeMessage(yomoclient: YoMoClient<MessageContent>) {
        yomoclient.on('message', data => {
            if (data.id === this.id) {
                this.onMessage(data.message);
            }
        });
    }

    private movement(yomoclient: YoMoClient<MessageContent>) {
        yomoclient.on('movement', data => {
            if (data.id !== this.id) {
                return;
            }
            const { mouseX, mouseY } = getMousePosition(data.x, data.y);
            super.move(mouseX, mouseY);
            this.onMove({ mouseX, mouseY });
        });
    }
}
