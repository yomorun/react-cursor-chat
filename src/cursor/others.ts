import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Room from '@yomo/presencejs/dist/room';
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

    goOnline(room: Room) {
        this.movementMessageSubscription = this.subscribeMovement(room);
        this.textMessageSubscription = this.subscribeTextMessage(room);
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

    private subscribeTextMessage(room: Room) {
        return room
            .fromServer<TextMessage>('text')
            .pipe(filter(data => data.id === this.id))
            .subscribe(data => {
                this.onTextMessage(data.message);
            });
    }

    private subscribeMovement(room: Room) {
        return room
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
