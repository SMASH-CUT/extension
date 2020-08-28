import React, { useEffect } from 'react';

const CONTENT = 'c';
const TIMESTAMP = 'ts';
const SCENE = 's';
const NEXT_SCENE = 'ns';

export default (playing, time, script, pageIndex, sceneIndex,
    sectionIndex, setPageIndex, setSceneIndex, setSectionIndex) => {
    useEffect(() => {
        if (!playing || !script || !script.length) {
            return;
        }
        const currLine = script[pageIndex][CONTENT][sceneIndex][SCENE][sectionIndex];

        if (!currLine || !currLine[TIMESTAMP]) {
            return;
        }

        const timeLimit = currLine[TIMESTAMP][1];
        if (timeLimit > time) {
            return;
        }

        const pagesExists = script.length > pageIndex + 1;
        const sectionExists = script.length > pageIndex
            && script[pageIndex][CONTENT].length > sceneIndex
            && script[pageIndex][CONTENT][sceneIndex][SCENE].length > sectionIndex + 1;

        if (sectionExists) {
            setSectionIndex((updatedSectionIndex) => updatedSectionIndex + 1);
        } else if (script[pageIndex][CONTENT][sceneIndex][NEXT_SCENE]) {
            setPageIndex(script[pageIndex][CONTENT][sceneIndex][NEXT_SCENE][0]);
            setSceneIndex(script[pageIndex][CONTENT][sceneIndex][NEXT_SCENE][1]);
            setSectionIndex(0);
        } else if (pagesExists) {
            setPageIndex((updatedPageIndex) => updatedPageIndex + 1);
            setSceneIndex(0);
            setSectionIndex(0);
        }
    }, [script, time, playing, pageIndex, sceneIndex,
        sectionIndex, setPageIndex, setSceneIndex, setSectionIndex]);
}; 
