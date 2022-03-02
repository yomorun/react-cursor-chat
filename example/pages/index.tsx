import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import CursorChat from '@yomo/react-cursor-chat';
import '@yomo/react-cursor-chat/dist/light.css';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>cursor-chat-demo</title>
                <meta name="description" content="yomo cursor chat example" />
                <link rel="icon" href="/favicon.ico" />
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                    crossOrigin="true"
                />
                <link
                    rel="stylesheet"
                    media="print"
                    href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400&amp;display=swap"
                />
            </Head>

            <main className={styles.main}>
                <Image width={100} height={100} src="/logo.png" alt="logo" />
                <p className={styles.tips}>
                    Press <span>/</span> to bring up the input box <br /> Press{' '}
                    <span>ESC</span> to close the input box
                </p>
                <CursorChat
                    showLatency
                    presenceURL="https://prsc.yomo.dev"
                    presenceAuthEndpoint="/api/auth"
                    avatar={`/cursor-avatar-${new Date().getSeconds() % 9}.png`}
                />
            </main>
        </div>
    );
};

export default Home;
