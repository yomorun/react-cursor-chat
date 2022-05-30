import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Presence from '@yomo/presencejs';
import Cursor from './cursor';
import { getMousePosition } from '../helper';
import { MovementMessage, TextMessage } from '../types';

export default class Other extends Cursor {
    private subscription: Subscription | undefined;

    constructor({
        id,
        x,
        y,
        name = '',
        avatar = '',
        color = '',
    }: {
        id: string;
        x: number;
        y: number;
        name?: string;
        avatar?: string;
        color: string;
    }) {
        super(id, x, y, name, avatar, color);
    }

    goOnline(yomo: Presence) {
        this.subscription = this.subscribeMovement(yomo);
        const textMessageSubscription = this.subscribeTextMessage(yomo);
        const latencySubscription = super.subscribeLatency(yomo);
        const leaveSubscription = this.subscribeLeave(yomo);
        const enterSubscription = this.subscribeEnter(yomo);
        this.subscription.add(textMessageSubscription);
        this.subscription.add(latencySubscription);
        this.subscription.add(leaveSubscription);
        this.subscription.add(enterSubscription);
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

    private subscribeLeave(yomo: Presence) {
        return yomo
            .on$<MovementMessage>('leave')
            .pipe(filter(data => data.id === this.id))
            .subscribe(() => {
                this.onLeave();
            });
    }

    private subscribeEnter(yomo: Presence) {
        return yomo
            .on$<MovementMessage>('enter')
            .pipe(filter(data => data.id === this.id))
            .subscribe(() => {
                this.onEnter();
            });
    }

    onLeave() {
        throw new Error('Method not implemented.');
    }

    onEnter() {
        throw new Error('Method not implemented.');
    }
}
