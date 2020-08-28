import React, { useEffect } from 'react';

export default (setTime) => {
    const playButtonObserver = new MutationObserver(() => {
        const base = '.button-nfplayer';
        const fastForward = `${base}FastForward`;
        const fastBackward = `${base}nfplayerBackTen`;
        try {
            if (document.querySelector(fastForward)) {
                setTime((time) => time + 10);
            } else if (document.querySelector(fastBackward)) {
                setTime((time) => time - 10);
            }
        } catch (error) {
            console.error(error);
        }
    });

    useEffect(() => {
        const id = playButtonObserver.observe(document.body, { subtree: true, childList: true });
        return () => playButtonObserver.disconnect(id);
    });
}; 
