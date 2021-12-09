import { Subscription } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';
import Verse from 'yomo-js/dist/verse';
import Cursor from './cursor';
import { getScale } from '../helper';
import { CursorMessage, MovementMessage, TextMessage, OfflineMessage } from '../types';

export default class Me extends Cursor {
    private sendingTimeInterval: number;
    private verse: Verse | undefined;
    private onlineSubscription: Subscription | undefined;
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

    goOnline(verse: Verse) {
        this.verse = verse;
        this.online(verse);
        this.onlineSubscription = this.subscribeOnline(verse);
        if (this.mousePositionSubscription) {
            this.mousePositionSubscription.unsubscribe();
        }
        this.mousePositionSubscription = this.subscribeMousePosition(verse);
    }

    async goOffline() {
        if (this.verse) {
            this.verse.publish<OfflineMessage>('offline', {
                id: this.id,
            });
        }

        if (this.mousePositionSubscription) {
            this.mousePositionSubscription.unsubscribe();
            this.mousePositionSubscription = undefined;
        }

        if (this.onlineSubscription) {
            this.onlineSubscription.unsubscribe();
            this.onlineSubscription = undefined;
        }

        return await new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    sendMessage(message: string) {
        if (this.verse) {
            this.verse.publish<TextMessage>('text', {
                id: this.id,
                message: message,
            });
        }
    }

    private online(verse: Verse) {
        verse.publish<CursorMessage>('online', {
            id: this.id,
            x: 0,
            y: 0,
            name: this.name,
            avatar: this.avatar,
        });
    }

    private subscribeOnline(verse: Verse) {
        return verse.fromServer<any>('online').subscribe(() => {
            verse.publish<CursorMessage>('sync', {
                id: this.id,
                x: this.x,
                y: this.y,
                name: this.name,
                avatar: this.avatar,
            });
        });
    }

    private subscribeMousePosition(verse: Verse) {
        const mousemove$ = verse.fromEvent<MouseEvent>(document, 'mousemove');

        mousemove$.subscribe(event => {
            const { clientX, clientY } = event;
            super.move(clientX, clientY);
            this.onMove({ mouseX: clientX, mouseY: clientY });
        });

        const movement$ = mousemove$.pipe(
            throttleTime(this.sendingTimeInterval),
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

        return verse.bindServer<MovementMessage>(movement$, 'movement');
    }
}
