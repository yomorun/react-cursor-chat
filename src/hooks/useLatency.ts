import { useState, useEffect } from 'react';
import Others from '../cursor/others';
import Me from '../cursor/me';

const useLatency = (cursor: Me | Others) => {
    const [latencyData, setLatencyData] = useState({
        meshId: '',
        latency: 0,
        backgroundColor: 'green',
    });

    useEffect(() => {
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
    }, []);

    return latencyData;
};

export default useLatency;
