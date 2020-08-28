import React, { useEffect } from 'react';

export default (appContainer, showScreenplay,
    pageIndex, sceneIndex, sectionIndex, doneInit, autoScrollFirst, setAutoScrollFirst) => {
    useEffect(() => {
        if (appContainer && doneInit && showScreenplay) {
            const main = appContainer.getElementsByClassName('mainApp')[0];
            const test = main.querySelector(`#action${pageIndex}-${sceneIndex}-${sectionIndex}`);
            if (test) {
                test.scrollIntoView({
                    behavior: autoScrollFirst ? 'auto' : 'smooth',
                    block: 'center',
                    inline: 'center',
                });
                setAutoScrollFirst(false);
            }
        }
    }, [appContainer, showScreenplay, pageIndex, sceneIndex,
        sectionIndex, doneInit, autoScrollFirst, setAutoScrollFirst]);
}; 
