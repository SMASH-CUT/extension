import React from 'react';
import getInitialIndexAndDuration from 'utils/getInitialIndexAndDuration';

const base = '.default-control-button.button-nfplayer';
const fastForward = `${base}FastForward`;
const fastBackward = `${base}nfplayerBackTen`;

export default (script, setTime, setPageIndex,
    setSceneIndex, setSectionIndex, setDoneInit, setDoneLoading) => {
    let scrubberId;
    let forwardId;
    let backwardId;
    if (script) {
        if (document.querySelector('.scrubber-bar')) {
            const time = parseInt(document.querySelector('.scrubber-head').getAttribute('aria-valuenow'), 10);
            scrubberId = document.querySelector('.scrubber-bar').addEventListener('click', () => {
                setTime(time);
                getInitialIndexAndDuration(
                    time,
                    script,
                    setPageIndex,
                    setSceneIndex,
                    setSectionIndex,
                    setDoneInit,
                    setDoneLoading
                );
            });

            if (document.querySelector(fastForward)) {
                forwardId = document.querySelector(fastForward).addEventListener('click', () => {
                    getInitialIndexAndDuration(
                        time + 10,
                        script,
                        setPageIndex,
                        setSceneIndex,
                        setSectionIndex,
                        setDoneInit,
                        setDoneLoading
                    );
                });
            }

            if (document.querySelector(fastBackward)) {
                backwardId = document.querySelector(fastBackward).addEventListener('click', () => {
                    getInitialIndexAndDuration(
                        time - 10,
                        script,
                        setPageIndex,
                        setSceneIndex,
                        setSectionIndex,
                        setDoneInit,
                        setDoneLoading
                    );
                });
            }
        }
    }
    return () => {
        if (scrubberId) {
            document.querySelector('.scrubber-bar').removeEventListener('click', scrubberId);
        }
        if (forwardId) {
            document.querySelector(fastForward).removeEventListener('click', forwardId);
        }
        if (backwardId) {
            document.querySelector(backwardId).removeEventListener('click', backwardId);
        }
    };
}; 
