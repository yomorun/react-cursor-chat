import { useEffect, useState } from 'react';

import Me from '../cursor/me';
import Mate from '../cursor/mate';

import { YoMoClient } from 'yomo-js';
import { uuidv4 } from '../helper';
import { MessageContent } from '../types';

const ID = uuidv4();

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
    const [matesMap, setMatesMap] = useState<Map<string, Mate>>(
        new Map<string, Mate>()
    );
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const yomoclient = new YoMoClient<MessageContent>(socketURL, {
            reconnectInterval: 5000,
            reconnectAttempts: 5,
        });

        // `online` event will be occured when user is connected to websocket
        yomoclient.on('online', data => {
            if (data.id === ID) {
                return;
            }
            setMatesMap(old => {
                if (old.has(data.id)) {
                    return old;
                }
                const cursorMap = new Map(old);
                const mate = new Mate(data);
                mate.goOnline(yomoclient);
                cursorMap.set(mate.id, mate);
                return cursorMap;
            });
        });

        yomoclient.on('offline', data => {
            setMatesMap(old => {
                const cursorMap = new Map(old);
                cursorMap.delete(data.id);
                return cursorMap;
            });
        });

        // Answer server query, when other mates go online, server will ask others' states,
        // this is the response
        yomoclient.on('sync', data => {
            if (data.id === ID) {
                return;
            }
            setMatesMap(old => {
                if (old.has(data.id)) {
                    return old;
                }
                const cursorMap = new Map(old);
                const mate = new Mate(data);
                mate.goOnline(yomoclient);
                cursorMap.set(mate.id, mate);
                return cursorMap;
            });
        });

        const me = new Me({
            id: ID,
            x: 0,
            y: 0,
            name: name || '',
            avatar: avatar || '',
            sendingTimeInterval: sendingTimeInterval,
        });

        setMe(me);

        const connectionState = yomoclient.connectionStatus();
        const connectionSubscription = connectionState.subscribe(
            (isConnected: boolean) => {
                setIsConnected(isConnected);
                if (isConnected) {
                    me.goOnline(yomoclient);
                }
            }
        );

        window.onunload = async () => {
            await me.goOffline();
            connectionSubscription.unsubscribe();
            yomoclient.close();
        };
    }, []);

    const mates: Mate[] = [];

    matesMap.forEach(value => {
        mates.push(value);
    });

    return { me, mates, isConnected };
};

export default useOnlineCursor;
