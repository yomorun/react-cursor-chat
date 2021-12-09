import { useEffect, useState } from 'react';

import Me from '../cursor/me';
import Others from '../cursor/others';

import { YoMoClient } from 'yomo-js';
import { uuidv4 } from '../helper';
import { CursorMessage, OfflineMessage } from '../types';

const useOnlineCursor = ({
    socketURL,
    sendingTimeInterval = 100,
    name,
    avatar,
}: {
    socketURL: string;
    sendingTimeInterval?: number;
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
            sendingTimeInterval: sendingTimeInterval,
        });

        setMe(me);

        const yomoclient = new YoMoClient(socketURL, {
            reconnectInterval: 5000,
            reconnectAttempts: 5,
        });

        yomoclient.on('connected', () => {
            const verse = yomoclient.getVerse('001');

            verse.fromServer<CursorMessage>('online').subscribe(data => {
                if (data.id === ID) {
                    return;
                }
                setOthersMap(old => {
                    if (old.has(data.id)) {
                        return old;
                    }
                    const cursorMap = new Map(old);
                    const others = new Others(data);
                    others.goOnline(verse);
                    cursorMap.set(others.id, others);
                    return cursorMap;
                });
            });

            verse.fromServer<OfflineMessage>('offline').subscribe(data => {
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
            verse.fromServer<CursorMessage>('sync').subscribe(data => {
                if (data.id === ID) {
                    return;
                }
                setOthersMap(old => {
                    if (old.has(data.id)) {
                        return old;
                    }
                    const cursorMap = new Map(old);
                    const others = new Others(data);
                    others.goOnline(verse);
                    cursorMap.set(others.id, others);
                    return cursorMap;
                });
            });

            me.goOnline(verse);
        });

        // yomoclient.on('closed', () => {});

        window.onunload = async () => {
            await me.goOffline();
            yomoclient.close();
        };

        // return () => {
        //     (async () => {
        //         await me.goOffline();
        //         yomoclient.close();
        //     })();
        // };
    }, []);

    const others: Others[] = [];

    othersMap.forEach(value => {
        others.push(value);
    });

    return { me, others };
};

export default useOnlineCursor;
