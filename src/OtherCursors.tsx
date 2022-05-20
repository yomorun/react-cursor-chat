import React from 'react';
import Others from './cursor/other';
import OtherCursor from './OtherCursor';

const OthersCursors = ({
    others,
    showLatency = false,
}: {
    others: Others[];
    showLatency?: boolean;
}) => {
    return (
        <>
            {others.map(item => (
                <OtherCursor
                    key={item.id}
                    cursor={item}
                    showLatency={showLatency}
                />
            ))}
        </>
    );
};

export default OthersCursors;
