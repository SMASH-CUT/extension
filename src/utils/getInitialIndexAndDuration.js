const CONTENT = 'c';
const TIMESTAMP = 'ts';
const SCENE = 's';

export default function getInitialIndexAndDuration(time, script, setPageIndex,
    setSceneIndex, setSectionIndex, setDoneInit,
    setDoneLoading) {
    let scriptTime = 0;
    let currentPageIndex = 0;
    let minTimeScene = null;

    while (script && currentPageIndex < script.length) {
        const page = script[currentPageIndex];
        let currentSceneIndex = 0;
        while (currentSceneIndex < page[CONTENT].length) {
            const content = page[CONTENT][currentSceneIndex];

            if (page.type === 'FIRST_PAGES') {
                const duration = content[TIMESTAMP] ? content[TIMESTAMP][1] - content[TIMESTAMP][0] : 1;
                scriptTime += (duration || 0);
            } else {
                let currentSectionIndex = 0;
                while (currentSectionIndex < content[SCENE].length) {
                    const scene = content[SCENE][currentSectionIndex];
                    const duration = scene[TIMESTAMP] ? (scene[TIMESTAMP][1] - scene[TIMESTAMP][0]) : 1;

                    if (scene[TIMESTAMP]) {
                        // eslint-disable-next-line comma-spacing
                        [scriptTime,] = scene[TIMESTAMP];
                    } else {
                        scriptTime += (duration || 0);
                    }

                    if (!minTimeScene || Math.abs(time - minTimeScene[0]) > Math.abs(time - scriptTime)) {
                        minTimeScene = [scriptTime, [currentPageIndex, currentSceneIndex, currentSectionIndex]];
                    }
                    currentSectionIndex += 1;
                }
            }

            currentSceneIndex += 1;
        }
        currentPageIndex += 1;
    }

    setPageIndex(minTimeScene[1][0]);
    setSceneIndex(minTimeScene[1][1]);
    setSectionIndex(minTimeScene[1][2]);

    setDoneLoading(false);
    setDoneInit(true);
}
