import { YoMoClient } from 'yomo-js';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import Cursor from '.';
import { getScale } from '../helper';
import { MessageContent } from '../types';

export default class Me extends Cursor {
    private sendingTimeInterval: number;
    private yomoclient: YoMoClient<MessageContent> | undefined;
    private mousePositionSubscription: Subscription | undefined;

    constructor({
        id,
        x,
        y,
        name = '',
        avatar = '',
        sendingTimeInterval = 100,
    }: {
        id: string;
        x: number;
        y: number;
        name?: string;
        avatar?: string;
        sendingTimeInterval?: number;
    }) {
        super(id, x, y, name, avatar);
        this.sendingTimeInterval = sendingTimeInterval;
    }

    goOnline(yomoclient: YoMoClient<MessageContent>) {
        this.yomoclient = yomoclient;
        this.online(yomoclient);
        this.subscribeSyncEvent(yomoclient);
        if (this.mousePositionSubscription) {
            this.mousePositionSubscription.unsubscribe();
        }
        this.mousePositionSubscription = this.subscribeMousePosition(
            yomoclient
        );
    }

    async goOffline() {
        if (this.mousePositionSubscription) {
            this.mousePositionSubscription.unsubscribe();
            this.mousePositionSubscription = undefined;
        }

        this.yomoclient &&
            this.yomoclient.emit('offline', {
                id: this.id,
            });
        return await new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    sendMessage(message: string) {
        this.yomoclient &&
            this.yomoclient.emit('message', {
                id: this.id,
                message: message,
            });
    }

    private online(yomoclient: YoMoClient<MessageContent>) {
        yomoclient.emit('online', {
            id: this.id,
            x: 0,
            y: 0,
            name: this.name,
            avatar: this.avatar,
        });
    }

    private subscribeSyncEvent(yomoclient: YoMoClient<MessageContent>) {
        yomoclient.on('online', () => {
            yomoclient.emit('sync', {
                id: this.id,
                x: this.x,
                y: this.y,
                name: this.name,
                avatar: this.avatar,
            });
        });
    }

    private subscribeMousePosition(yomoclient: YoMoClient<MessageContent>) {
        const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');

        mousemove$.subscribe(event => {
            const { clientX, clientY } = event;
            super.move(clientX, clientY);
            this.onMove({ mouseX: clientX, mouseY: clientY });
        });

        return mousemove$
            .pipe(throttleTime(this.sendingTimeInterval))
            .subscribe(() => {
                // Broadcast movement event streams to others in this game room
                this.sendPosition(yomoclient);
            });
    }

    private sendPosition(yomoclient: YoMoClient<MessageContent>) {
        const { scaleX, scaleY } = getScale(this.x, this.y);
        yomoclient.emit('movement', {
            id: this.id,
            x: scaleX,
            y: scaleY,
        });
    }
}
