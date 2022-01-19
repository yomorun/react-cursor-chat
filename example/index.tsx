import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CursorChat from '../.';

import '../dist/cursor-chat.min.css';

import logo from './logo.png';
import avatar0 from './avatar/cursor-avatar-0.png';
import avatar1 from './avatar/cursor-avatar-1.png';
import avatar2 from './avatar/cursor-avatar-2.png';
import avatar3 from './avatar/cursor-avatar-3.png';
import avatar4 from './avatar/cursor-avatar-4.png';
import avatar5 from './avatar/cursor-avatar-5.png';
import avatar6 from './avatar/cursor-avatar-6.png';
import avatar7 from './avatar/cursor-avatar-7.png';
import avatar8 from './avatar/cursor-avatar-8.png';

const avatars = {
    avatar0,
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
};

const App = () => {
    return (
        <div className="main">
            <img className="logo" src={logo} alt="logo" />
            <p className="tips">
                Press <span>/</span> to bring up the input box <br /> Press{' '}
                <span>ESC</span> to close the input box
            </p>
            <CursorChat
                presenceURL="wss://presence.yomo.dev"
                presenceAuth={{
                    type: 'publickey',
                    publicKey: 'CursorChat'
                }}
                avatar={avatars[`avatar${new Date().getSeconds() % 9}`]}
                theme="light"
            />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
