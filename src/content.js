/* eslint-disable react/jsx-filename-extension */
import 'libs/polyfills';
import React, { useState, useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import ReactDOM from 'react-dom';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import Box from 'components/Box';
import ScreenplayBox from 'components/ScreenplayBox';
import ToggleButton from 'components/ToggleButton';
import defaultTheme from 'themes/default';
import Screenplay from 'components/Screenplay';

smoothscroll.polyfill();

const root = document.createElement('div');
root.setAttribute('id', 'extension');
const shadow = root.attachShadow({ mode: 'open' });
const styleContainer = document.createElement('div');
const appContainer = document.createElement('div');
appContainer.setAttribute('id', 'app');
shadow.appendChild(styleContainer);
shadow.appendChild(appContainer);
document.body.appendChild(root);


const App = () => {
  const [script, setScript] = useState([]);
  const [fadeInToggleButton, setFadeInToggleButton] = useState(true);

  const [pageIndex, setPageIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);

  const [playing, setPlaying] = useState(null);

  const [showScreenplay, setShowScreenplay] = useState(false);
  const [temporaryScreenplayHide, setTemporaryScreenplayHide] = useState(false);

  const TITLE_SUMMARY_APPEARRANCE_SECONDS = 7700;
  const PLAYBACK_BUTTONS_DISAPPEAR_SECONDS = 3000;

  const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
      window.addEventListener('mousemove', setFromEvent);

      return () => {
        window.removeEventListener('mousemove', setFromEvent);
      };
    }, []);

    return position;
  };

  const position = useMousePosition();
  useEffect(() => {
    setFadeInToggleButton(true);
    const mousePositionTimeout = setTimeout(() => {
      setFadeInToggleButton(false);
    }, PLAYBACK_BUTTONS_DISAPPEAR_SECONDS);
    return () => clearTimeout(mousePositionTimeout);
  }, [position, setFadeInToggleButton]);

  useEffect(() => {
    setTemporaryScreenplayHide(false);
    const mousePositionTimeout = setTimeout(() => {
      if (!playing) {
        setTemporaryScreenplayHide(true);
      }
    }, TITLE_SUMMARY_APPEARRANCE_SECONDS);
    return () => clearTimeout(mousePositionTimeout);
  }, [playing, position, setTemporaryScreenplayHide]);

  const scroller = (event) => {
    const scrollable = appContainer.getElementsByClassName('scrollable')[0];
    switch (event && event.deltaMode) {
      case 0: // DOM_DELTA_PIXEL Chrome
        scrollable.scrollTop += event.deltaY;
        scrollable.scrollLeft += event.deltaX;
        break;
      case 1: // DOM_DELTA_LINE Firefox
        scrollable.scrollTop += 15 * event.deltaY;
        scrollable.scrollLeft += 15 * event.deltaX;
        break;
      case 2: // DOM_DELTA_PAGE
        scrollable.scrollTop += 0.03 * event.deltaY;
        scrollable.scrollLeft += 0.03 * event.deltaX;
        break;
      default:
        break;
    }
  };


  document.onwheel = scroller;

  return (
    <div id="actualApp">
      <StyleSheetManager id="stylesheetManager" target={styleContainer}>
        <ThemeProvider theme={defaultTheme}>
          {script && script.length && (
            <Box
              position="absolute"
              top="2vh"
              left="91vw"
              style={{ zIndex: 1 }}
              onClick={() => setShowScreenplay((show) => !show)}
            >
              <ToggleButton fadeInToggleButton={fadeInToggleButton}>Toggle Script</ToggleButton>
            </Box>
          )}
          <section>
            {true
              && (
                <ScreenplayBox
                  temporaryScreenplayHide={temporaryScreenplayHide}
                  class="scrollable"
                  ark
                  bottom={3}
                  right={3}
                  // backgroundColor="black"
                  height="100%"
                  overflowY="scroll"
                  overflowX="hidden"
                  smoothscroll
                  objectFit="cover"
                  style={{
                    position: 'absolute',
                    scrollMargintop: '50vh',
                    pointerEvents: 'none',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    boxShadow: '0 0 5px 10px rgba(0,0,0,0.1)',
                    width: script && script.length && showScreenplay ? '100vw' : '0vw',
                    height: () => {
                      if (!(script && script.length)) {
                        return 0;
                      }
                      if (showScreenplay && !fadeInToggleButton) {
                        return '100vh';
                      }
                      if (showScreenplay) {
                        return '87vh';
                      }
                      return 0;
                    },
                    marginBottom: '11vh'
                    // marginBottom: script && script.length && !fadeInToggleButton ? 0 : '11vh'
                  }}
                >
                  <Screenplay
                    appContainer={appContainer}
                    script={script}
                    setScript={setScript}
                    playing={playing}
                    showScreenplay={showScreenplay}
                    pageIndex={pageIndex}
                    sceneIndex={sceneIndex}
                    sectionIndex={sectionIndex}
                    setPageIndex={setPageIndex}
                    setSceneIndex={setSceneIndex}
                    setSectionIndex={setSectionIndex}
                    setPlaying={setPlaying}
                  />
                </ScreenplayBox>
              )}
          </section>

        </ThemeProvider>
      </StyleSheetManager>
    </div>
  );
};

ReactDOM.render(<App />, appContainer);
