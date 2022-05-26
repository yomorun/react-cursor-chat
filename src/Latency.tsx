import React, { useState, useEffect } from 'react';
import Me from './cursor/me';
import Other from './cursor/other';

const Latency = ({
    cursor,
    showLatency,
}: {
    cursor: Me | Other;
    showLatency: boolean;
}) => {
    const [latencyData, setLatencyData] = useState({
        meshId: '',
        latency: 0,
    });

    useEffect(() => {
        if (showLatency) {
            cursor.onGetLatency = data => {
                setLatencyData({
                    meshId: data.meshId,
                    latency: data.latency,
                });
            };
        } else {
            cursor.onGetLatency = _ => {};
            setLatencyData({
                meshId: '',
                latency: 0,
            });
        }
    }, [showLatency]);

    if (latencyData.latency === 0) {
        return null;
    }

    return (
        <div className="online-cursor-wrapper__latency-box">
            &nbsp;
            <svg
                width="8"
                height="10"
                viewBox="0 0 8 10"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.99993 0C4.99609 0 5.99332 0.367541 6.77237 1.10262C8.41307 2.65187 8.37032 5.28494 6.87655 6.95267L6.72235 7.11615L4.43096 9.41998C4.31176 9.53999 4.15531 9.6 3.99886 9.6C3.87371 9.6 3.74855 9.5616 3.64246 9.48479L3.56677 9.41998L1.27751 7.11508C-0.365737 5.46061 -0.467907 2.70352 1.22855 1.10262C2.00654 0.367541 3.00377 0 3.99993 0ZM3.99993 1C3.22932 1 2.48657 1.28975 1.91488 1.82992C0.711907 2.96512 0.701036 4.96169 1.84937 6.26336L1.98702 6.41038L3.999 8.436L6.01284 6.41146C7.2978 5.11772 7.33439 3.00868 6.08609 1.82996C5.51361 1.28979 4.77055 1 3.99993 1ZM4 2C5.10238 2 6 2.89762 6 4C6 5.10238 5.10238 6 4 6C2.89762 6 2 5.10238 2 4C2 2.89762 2.89762 2 4 2ZM4 3C3.4499 3 3 3.4499 3 4C3 4.5501 3.4499 5 4 5C4.5501 5 5 4.5501 5 4C5 3.4499 4.5501 3 4 3Z"
                    fill="white"
                />
            </svg>
            &nbsp;
            <span>{latencyData.meshId}</span>&nbsp;
            <span>{latencyData.latency}ms</span>&nbsp;
        </div>
    );
};

export default Latency;
