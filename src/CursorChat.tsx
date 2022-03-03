import React, { memo } from 'react';
import useOnlineCursor from './hooks/useOnlineCursor';
import OthersCursor from './OthersCursor';
import MeCursor from './MeCursor';
import './styles/hairy-green.css';
import './styles/apricot-yellow.css';

const CursorChat = ({
    presenceURL,
    presenceAuthEndpoint,
    room,
    showLatency = false,
    name,
    avatar,
}: {
    presenceURL: string;
    presenceAuthEndpoint: string;
    room?: string;
    showLatency?: boolean;
    name?: string;
    avatar?: string;
}): JSX.Element | null => {
    const { me, others } = useOnlineCursor({
        presenceURL,
        presenceAuthEndpoint,
        room,
        name,
        avatar,
    });

    if (!me) {
        return null;
    }

    return (
        <div className="online-cursor-wrapper">
            {others.map(item => (
                <OthersCursor
                    key={item.id}
                    cursor={item}
                    showLatency={showLatency}
                />
            ))}
            <MeCursor cursor={me} showLatency={showLatency} />
        </div>
    );
};

export default memo(CursorChat);
