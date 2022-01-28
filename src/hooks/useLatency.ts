import { useState, useEffect } from 'react';
import Others from '../cursor/others';
import Me from '../cursor/me';

const useLatency = (cursor: Me | Others, showLatency: boolean) => {
    const [latencyData, setLatencyData] = useState({
        meshId: '',
        latency: 0,
        backgroundColor: 'green',
    });

    useEffect(() => {
        if (showLatency) {
            cursor.onGetLatency = data => {
                if (data.latency) {
                    let backgroundColor = 'green';
                    if (data.latency >= 200 && data.latency < 300) {
                        backgroundColor = '#FFB02A';
                    }
                    if (data.latency >= 300) {
                        backgroundColor = 'red';
                    }
                    setLatencyData({
                        backgroundColor,
                        meshId: data.meshId,
                        latency: data.latency,
                    });
                }
            };
        } else {
            cursor.onGetLatency = _ => {};
            setLatencyData({
                meshId: '',
                latency: 0,
                backgroundColor: 'green',
            });
        }
    }, [showLatency]);

    return latencyData;
};

export default useLatency;
