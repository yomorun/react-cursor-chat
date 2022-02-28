import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Presence from '@yomo/presencejs';
import Cursor from './cursor';
import { getMousePosition } from '../helper';
import { MovementMessage, TextMessage } from '../types';

export default class Others extends Cursor {
    private subscription: Subscription | undefined;

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
        this.subscription = this.subscribeMovement(yomo);
        const textMessageSubscription = this.subscribeTextMessage(yomo);
        const latencySubscription = super.subscribeLatency(yomo);
        this.subscription.add(textMessageSubscription);
        this.subscription.add(latencySubscription);
    }

    unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe();
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
