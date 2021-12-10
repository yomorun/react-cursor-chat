import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Verse from 'yomo-js/dist/verse';
import Cursor from './cursor';
import { getMousePosition } from '../helper';
import { MovementMessage, TextMessage } from '../types';
export default class Others extends Cursor {
    private textMessageSubscription: Subscription | undefined;
    private movementMessageSubscription: Subscription | undefined;

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

    goOnline(verse: Verse) {
        this.movementMessageSubscription = this.movement(verse);
        this.textMessageSubscription = this.subscribeTextMessage(verse);
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
    }

    onTextMessage(_message: string) {}

    private subscribeTextMessage(verse: Verse) {
        return verse
            .fromServer<TextMessage>('text')
            .pipe(filter(data => data.id === this.id))
            .subscribe(data => {
                this.onTextMessage(data.message);
            });
    }

    private movement(verse: Verse) {
        return verse
            .fromServer<MovementMessage>('movement')
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
