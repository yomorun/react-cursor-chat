import React, { useEffect, useMemo, useState } from 'react';
import Others from './cursor/others';
import CursorIcon from './CursorIcon';
import Latency from './Latency';
import useRenderPosition from './hooks/useRenderPosition';

const OthersCursor = ({
    cursor,
    showLatency,
}: {
    cursor: Others;
    showLatency: boolean;
}) => {
    const refContainer = useRenderPosition(cursor);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        cursor.onTextMessage = (msg: string) => {
            setMsg(msg);
        };
    }, []);

    return useMemo(
        () => (
            <div className="online-cursor-wrapper__cursor" ref={refContainer}>
                <CursorIcon color={cursor.color} />
                <Latency cursor={cursor} showLatency={showLatency} />

                <div
                    className="online-cursor-wrapper__tail-box"
                    style={{
                        borderBottomLeftRadius: msg ? 30 : 15,
                    }}
                >
                    <div className="online-cursor-wrapper__user">
                        {cursor.avatar && (
                            <img
                                className="online-cursor-wrapper__avatar"
                                src={cursor.avatar}
                                alt="avatar"
                            />
                        )}
                        {cursor.name && (
                            <span className="online-cursor-wrapper__name">
                                {cursor.name}
                            </span>
                        )}
                    </div>
                    {msg && (
                        <div className="online-cursor-wrapper__text">{msg}</div>
                    )}
                </div>
            </div>
        ),
        [msg, showLatency]
    );
};

export default OthersCursor;
