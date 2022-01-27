import { useEffect, useState } from 'react';

import Me from '../cursor/me';
import Others from '../cursor/others';

import { Presence } from '@yomo/presencejs';
import { uuidv4 } from '../helper';
import { CursorMessage, OfflineMessage } from '../types';
import { filter } from 'rxjs/operators';

const useOnlineCursor = ({
    presenceURL,
    presenceAuth,
    room,
    name,
    avatar,
}: {
    presenceURL: string;
    presenceAuth: {
        type: 'publickey' | 'token';
        // The public key in your Allegro Mesh project.
        publicKey?: string;
        // api for getting access token
        endpoint?: string;
    };
    room?: string;
    name?: string;
    avatar?: string;
}) => {
    const [me, setMe] = useState<Me | null>(null);
    const [othersMap, setOthersMap] = useState<Map<string, Others>>(
        new Map<string, Others>()
    );

    useEffect(() => {
        const ID = uuidv4();

        const me = new Me({
            id: ID,
            x: 0,
            y: 0,
            name: name || '',
            avatar: avatar || '',
        });

        setMe(me);

        const yomo = new Presence(presenceURL, {
            auth: presenceAuth,
        });

        yomo.on('connected', () => {
            if (room) {
                yomo.toRoom(room);
            }

            yomo.on$<CursorMessage>('online')
                .pipe(filter(data => data.id !== ID))
                .subscribe(data => {
                    setOthersMap(old => {
                        if (old.has(data.id)) {
                            return old;
                        }
                        const cursorMap = new Map(old);
                        const others = new Others(data);
                        others.goOnline(yomo);
                        cursorMap.set(others.id, others);
                        return cursorMap;
                    });
                });

            yomo.on<OfflineMessage>('offline', data => {
                setOthersMap(old => {
                    const cursorMap = new Map(old);
                    const others = cursorMap.get(data.id);
                    if (others) {
                        others.unsubscribe();
                    }
                    cursorMap.delete(data.id);
                    return cursorMap;
                });
            });

            // Answer server query, when others others go online, server will ask otherss' states,
            // this is the response
            yomo.on$<CursorMessage>('sync')
                .pipe(filter(data => data.id !== ID))
                .subscribe(data => {
                    setOthersMap(old => {
                        if (old.has(data.id)) {
                            return old;
                        }
                        const cursorMap = new Map(old);
                        const others = new Others(data);
                        others.goOnline(yomo);
                        cursorMap.set(others.id, others);
                        return cursorMap;
                    });
                });

            me.goOnline(yomo);
        });

        // yomo.on('closed', () => {});

        const cleanup = async () => {
            await me.goOffline();
            yomo.close();
        };

        window.addEventListener('unload', cleanup);

        return () => {
            cleanup();
            window.removeEventListener('unload', cleanup);
        };
    }, [room]);

    const others: Others[] = [];

    othersMap.forEach(value => {
        others.push(value);
    });

    return { me, others };
};

export default useOnlineCursor;
