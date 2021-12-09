import { Subscription } from 'rxjs';
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
        return verse.fromServer<TextMessage>('text').subscribe(data => {
            if (data.id === this.id) {
                this.onTextMessage(data.message);
            }
        });
    }

    private movement(verse: Verse) {
        return verse.fromServer<MovementMessage>('movement').subscribe(data => {
            if (data.id !== this.id) {
                return;
            }
            const { mouseX, mouseY } = getMousePosition(data.x, data.y);
            super.move(mouseX, mouseY);
            this.onMove({ mouseX, mouseY });
        });
    }
}
