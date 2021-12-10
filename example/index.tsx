import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CursorChat from '../.';
import '../dist/cursor-chat.min.css'

const App = () => {
    return (
        <CursorChat
            socketURL="wss://ws-dev.yomo.run"
            sendingTimeInterval={200}
            avatar="https://avatars.githubusercontent.com/u/67308985?s=200&v=4"
            theme="light"
        />
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
