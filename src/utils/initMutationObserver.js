import 'libs/polyfills';
import { browser } from 'webextension-polyfill-ts';


// setting current timestamp, and retrieve/send movie name to background script
export default function initMutationObserver(script, initObserved,
    setTime, setInitObserved, setDoneLoading) {
    const timeInit = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.ariaValueNow) {
                setTime(parseInt(mutation.target.ariaValueNow, 10));
            } else {
                setTime(parseInt(mutation.target.attributes['aria-valuenow'].textContent, 10));
            }
            setInitObserved((currInitObserved) => ({ ...currInitObserved, timeSet: true }));
            timeInit.disconnect();
        });
    });


    const init = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (!Object.prototype.hasOwnProperty.call(initObserved, 'timeSet') && mutation.target.className === 'scrubber-bar') {
                // console.log('[Init] retrieving time');
                timeInit.observe(document.querySelector('.scrubber-head'), { subtree: true, childList: true, attributes: true });
            } else if (!Object.prototype.hasOwnProperty.call(initObserved, 'scriptSet') && mutation.target.className === 'PlayerControlsNeo__button-control-row') {
                // console.log('[Init] retrieving movie name');
                // console.log(`[Init] sending message ${movieTitle}`);
                browser.runtime.sendMessage('hi');
                setInitObserved((currInitObserved) => ({ ...currInitObserved, scriptSet: true }));
            }

            if (script && script.length && Object.keys(initObserved).length === 2) {
                // console.log('[Init] done');
                setDoneLoading(true);
                init.disconnect();
            }
        });
    });
    init.observe(document.body, { subtree: true, childList: true });
    return () => {
        init.disconnect();
    };
}
