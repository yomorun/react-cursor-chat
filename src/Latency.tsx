import React, { useState, useEffect } from 'react';
import Me from './cursor/me';
import Others from './cursor/others';

const Latency = ({
    cursor,
    showLatency,
}: {
    cursor: Me | Others;
    showLatency: boolean;
}) => {
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

    if (latencyData.latency === 0) {
        return null;
    }

    return (
        <div className="online-cursor-wrapper__latency">
            📍 {latencyData.meshId}{' '}
            <span
                style={{
                    backgroundColor: latencyData.backgroundColor,
                    color: '#fff',
                }}
            >
                {latencyData.latency}ms
            </span>
        </div>
    );
};

export default Latency;
