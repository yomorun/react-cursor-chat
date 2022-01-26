import { fromEvent, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Presence } from '@yomo/presencejs';
import Cursor from './cursor';
import { getScale } from '../helper';
import { CursorMessage, TextMessage, OfflineMessage } from '../types';

export default class Me extends Cursor {
    private yomo: Presence | undefined;
    private onlineSubscription: Subscription | undefined;
    private mousemoveSubscription: Subscription | undefined;
    private mousePositionSubscription: Subscription | undefined;
    private latencySubscription: Subscription | undefined;

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
        this.mousemoveSubscription = this.subscribeMousemove();
    }

    goOnline(yomo: Presence) {
        this.yomo = yomo;
        this.online(yomo);
        this.onlineSubscription = this.subscribeOnline(yomo);
        if (this.mousePositionSubscription) {
            this.mousePositionSubscription.unsubscribe();
        }
        this.mousePositionSubscription = this.subscribeMousePosition(yomo);
        this.latencySubscription = super.subscribeLatency(yomo);
    }

    async goOffline() {
        if (this.yomo) {
            this.yomo.send<OfflineMessage>('offline', {
                id: this.id,
            });
        }

        if (this.mousemoveSubscription) {
            this.mousemoveSubscription.unsubscribe();
            this.mousemoveSubscription = undefined;
        }

        if (this.mousePositionSubscription) {
            this.mousePositionSubscription.unsubscribe();
            this.mousePositionSubscription = undefined;
        }

        if (this.onlineSubscription) {
            this.onlineSubscription.unsubscribe();
            this.onlineSubscription = undefined;
        }

        if (this.latencySubscription) {
            this.latencySubscription.unsubscribe();
            this.latencySubscription = undefined;
        }

        return await new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    sendMessage(message: string) {
        if (this.yomo) {
            this.yomo.send<TextMessage>('text', {
                id: this.id,
                message: message,
            });
        }
    }

    private online(yomo: Presence) {
        yomo.send<CursorMessage>('online', {
            id: this.id,
            x: 0,
            y: 0,
            name: this.name,
            avatar: this.avatar,
        });
    }

    private subscribeOnline(yomo: Presence) {
        return yomo.on$('online').subscribe(() => {
            yomo.send<CursorMessage>('sync', {
                id: this.id,
                x: this.x,
                y: this.y,
                name: this.name,
                avatar: this.avatar,
            });
        });
    }

    private subscribeMousemove() {
        const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');

        return mousemove$.subscribe(event => {
            const { clientX, clientY } = event;
            super.move(clientX, clientY);
            this.onMove({ mouseX: clientX, mouseY: clientY });
        });
    }

    private subscribeMousePosition(yomo: Presence) {
        const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');

        const movement$ = mousemove$.pipe(
            map(event => {
                const { scaleX, scaleY } = getScale(
                    event.clientX,
                    event.clientY
                );
                return {
                    id: this.id,
                    x: scaleX,
                    y: scaleY,
                };
            })
        );

        return movement$.subscribe(data => {
            yomo.send('movement', data);
        });
    }
}
