import React, { useEffect, useMemo, useState } from 'react';
import Other from './cursor/other';
import CursorIcon from './CursorIcon';
import Latency from './Latency';
import useRenderPosition from './hooks/useRenderPosition';
import useRenderOpacity from './hooks/useRenderOpacity';

const OtherCursor = ({
    cursor,
    showLatency,
}: {
    cursor: Other;
    showLatency: boolean;
}) => {
    const refContainer = useRenderPosition(cursor);
    useRenderOpacity(cursor, refContainer);
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

export default OtherCursor;
