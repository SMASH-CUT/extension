/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import 'libs/polyfills';
import React, { useEffect, useState } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import { browser } from 'webextension-polyfill-ts';
import RenderSwitch from 'utils/renderSwitch';

import useInterval from 'utils/useInterval';
import getInitialIndexAndDuration from 'utils/getInitialIndexAndDuration';
import initMutationObserver from 'utils/initMutationObserver';

import scrubberHook from './hooks/scrubberHook';
import keepScrollingHook from './hooks/keepScrollingHook';
import getNextSceneHook from './hooks/getNextSceneHook';
import playButtonHook from './hooks/playButtonHook';

smoothscroll.polyfill();

const CONTENT = 'c';
const SCENE = 's';
const SCENE_INFO = 'si';
const SCENE_NUMBER = 'sn';

const Screenplay = (props) => {
  // eslint-disable-next-line react/prop-types
  const {
    appContainer,
    setFrame,
    script,
    playing,
    setPlaying,
    setScript,
    pageIndex,
    sceneIndex,
    sectionIndex,
    setPageIndex,
    setSceneIndex,
    setSectionIndex,
    showScreenplay,
  } = props;
  const [time, setTime] = useState(0);

  const [doneLoading, setDoneLoading] = useState(false);
  const [autoScrollFirst, setAutoScrollFirst] = useState(true);
  const [doneInit, setDoneInit] = useState(false);
  const [initObserved, setInitObserved] = useState({});

  const [, setWidth] = useState('0vw');

  // TIME-INDEPENDENT HOOKS

  useEffect(() => {
    if (!(script && script.length)) {
      setDoneInit(false);
      setDoneLoading(false);
      setAutoScrollFirst(true);
    }
  }, [script]);

  useEffect(() => {
    if (!showScreenplay) {
        setAutoScrollFirst(true);
        setInitObserved({});
      }
  }, [showScreenplay]);

  // toggles screenplay UI on/off
  useEffect(() => {
    if (document.getElementsByClassName('sizing-wrapper')[0]) {
      if (script && script.length) {
        document.getElementsByClassName('sizing-wrapper')[0].style['z-index'] = '-1';
        document.getElementsByClassName('scrubber-container')[0].style['z-index'] = '3';
        setWidth('100vw');
      } else {
        setWidth('0vw');
        document.getElementsByClassName('sizing-wrapper')[0].style['z-index'] = '1';
      }
    }
  }, [setFrame, script, time, pageIndex, sceneIndex, sectionIndex, appContainer]);

  // // update screenplay position when user updates scrubber
  // useEffect(
  //   () =>
  //     scrubberHook(
  //       script,
  //       setTime,
  //       setPageIndex,
  //       setSceneIndex,
  //       setSectionIndex,
  //       setDoneInit,
  //       setDoneLoading
  //     ),
  //   [script, setTime, setPageIndex, setSceneIndex, setSectionIndex, setDoneInit, setDoneLoading]
  // );

  // pause/continue screenplay scrolling when user clicks the player
  playButtonHook(playing, setPlaying);

  // fastfoward/fastbackword
useEffect(() => {
  let scrubId;
  if (document.querySelector('.scrubber-bar')) {
    if (script && script.length) {
       scrubId = document.querySelector('.scrubber-bar').addEventListener('click', () => {
         const newTime = parseInt(
           document.querySelector('.scrubber-head').getAttribute('aria-valuenow'),
           10
         );
         setTime(newTime);
         getInitialIndexAndDuration(
           newTime,
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

  return () => document.removeEventListener('click', scrubId);
}, [script, setPageIndex, setSceneIndex, setSectionIndex]);

useEffect(() => {
  let fastId;
  const fastForward = '.button-nfplayerFastForward';
  if (document.querySelector(fastForward)) {
    if (script && script.length) {
      fastId = document.querySelector(fastForward).addEventListener('click', () => {
        const newTime = parseInt(
          document.querySelector('.scrubber-head').getAttribute('aria-valuenow'),
          10
        );
        getInitialIndexAndDuration(
          newTime,
          script,
          setPageIndex,
          setSceneIndex,
          setSectionIndex,
          setDoneInit,
          setDoneLoading
        );
        setTime(newTime);
      });
    }
  }

  return () => document.removeEventListener('click', fastId);
}, [script, time, setPageIndex, setSceneIndex, setSectionIndex]);

useEffect(() => {
  let fastId;
  const fastBackward = '.button-nfplayerBackTen';
  if (document.querySelector(fastBackward)) {
    if (script && script.length) {
      fastId = document.querySelector(fastBackward).addEventListener('click', () => {
        const newTime = parseInt(
          document.querySelector('.scrubber-head').getAttribute('aria-valuenow'),
          10
        );
        getInitialIndexAndDuration(
          newTime,
          script,
          setPageIndex,
          setSceneIndex,
          setSectionIndex,
          setDoneInit,
          setDoneLoading
        );
        setTime(newTime);
      });
    }
  }

  return () => document.removeEventListener('click', fastId);
}, [script, time, setPageIndex, setSceneIndex, setSectionIndex]);

  // scrolls the screenplay as time ticks
  keepScrollingHook(
    appContainer,
    showScreenplay,
    pageIndex,
    sceneIndex,
    sectionIndex,
    doneInit,
    autoScrollFirst,
    setAutoScrollFirst
  );

  // TIME-DEPENDENT HOOKS

  /*
script.length == 0 -> script not fetched, need to do that
doneLoading -> script is fetched, can start getting initial indices
doneInit -> script fetched, indices fetched, can start ticking script
*/

  useEffect(() => 
    initMutationObserver(script, initObserved, setTime, setInitObserved, setDoneLoading), 
  [script, initObserved, setTime, setInitObserved, setFrame, setDoneLoading]);

  const listener = (data) => {
    setScript(data);
  };
  browser.runtime.onMessage.addListener(listener);

  // get the indices the very first time user loads
  useEffect(() => {
    if (doneLoading && !doneInit) {
      getInitialIndexAndDuration(
        time,
        script,
        setPageIndex,
        setSceneIndex,
        setSectionIndex,
        setDoneInit,
        setDoneLoading
      );
    }
  }, [
    doneLoading,
    time,
    script,
    setDoneLoading,
    pageIndex,
    sceneIndex,
    sectionIndex,
    doneInit,
    setPageIndex,
    setSceneIndex,
    setSectionIndex,
    appContainer,
  ]);

  useInterval(
    () => {
      if (doneInit) {
        setTime((t) => t + 0.5);
      }
    },
    playing ? 500 : null
  );

  getNextSceneHook(
    playing,
    time,
    script,
    pageIndex,
    sceneIndex,
    sectionIndex,
    setPageIndex,
    setSceneIndex,
    setSectionIndex
  );

  const renderPage = () => {
    if (!script || !script.length) {
      return;
    }
    if ('type' in script[pageIndex]) {
      return 'page';
    }

    let previousSceneNumber = -1;
    let nextScene = false;

    return script.map((page, currPageIndex) =>
      page[CONTENT].map((content, currSceneIndex) =>
        content[SCENE].map((scene, currSectionIndex) => {
          if (previousSceneNumber !== content[SCENE_NUMBER]) {
            nextScene = true;
            previousSceneNumber = content[SCENE_NUMBER];
          } else {
            nextScene = false;
          }
          return RenderSwitch(
            scene,
            {
              sceneIndex: currSceneIndex,
              sectionIndex: currSectionIndex,
              pageIndex: currPageIndex,
            },
            { sceneIndex, sectionIndex, pageIndex },
            nextScene ? content[SCENE_INFO] : null,
            {
              page,
              script,
            }
          );
        })));
  };

  return (
    <div
      className="mainApp"
      style={{
        marginRight: '22vw',
        marginLeft: '22vw',
      }}
    >
      {showScreenplay ? renderPage() : ''}
    </div>
  );
};

export default Screenplay;
