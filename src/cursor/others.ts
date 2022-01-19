import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Presence } from '@yomo/presencejs';
import Cursor from './cursor';
import { getMousePosition } from '../helper';
import { MovementMessage, TextMessage } from '../types';
export default class Others extends Cursor {
    private textMessageSubscription: Subscription | undefined;
    private movementMessageSubscription: Subscription | undefined;
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
    }

    goOnline(yomo: Presence) {
        this.movementMessageSubscription = this.subscribeMovement(yomo);
        this.textMessageSubscription = this.subscribeTextMessage(yomo);
        this.latencySubscription = super.subscribeLatency(yomo);
    }

    unsubscribe() {
        if (this.textMessageSubscription) {
            this.textMessageSubscription.unsubscribe();
            this.textMessageSubscription = undefined;
        }

        if (this.movementMessageSubscription) {
            this.movementMessageSubscription.unsubscribe();
            this.movementMessageSubscription = undefined;
        }

        if (this.latencySubscription) {
            this.latencySubscription.unsubscribe();
            this.latencySubscription = undefined;
        }
    }

    onTextMessage(_message: string) {}

    private subscribeTextMessage(yomo: Presence) {
        return yomo
            .on$<TextMessage>('text')
            .pipe(filter(data => data.id === this.id))
            .subscribe(data => {
                this.onTextMessage(data.message);
            });
    }

    private subscribeMovement(yomo: Presence) {
        return yomo
            .on$<MovementMessage>('movement')
            .pipe(
                filter(data => data.id === this.id),
                map(data => getMousePosition(data.x, data.y))
            )
            .subscribe(({ mouseX, mouseY }) => {
                super.move(mouseX, mouseY);
                this.onMove({ mouseX, mouseY });
            });
    }
}
