import React, { useEffect } from 'react';

export default (playing, setPlaying) => {
    const playButtonObserver = new MutationObserver(() => {
        const base = '.button-nfplayer';
        const moviePlaying = `${base}Pause`;
        const moviePaused = `${base}Play`;
        try {
            if (document.querySelector(moviePlaying) && !playing) {
                setPlaying(true);
            } else if (document.querySelector(moviePaused) && playing) {
                setPlaying(false);
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
