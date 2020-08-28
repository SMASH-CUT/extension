import React from 'react';

const CONTENT = 'c';

const CHARACTER = 'ch';
const MODIFIER = 'm';
const DIALOGUE = 'd';

const REGION = 'r';
const LOCATION = 'l';
const TIME = 't';
const TYPE = 't';

// const SCENE = 's';

// const determineOrderOfLines = (line1, line2) => {
//   if (line1.pageIndex > line2.pageIndex) {
//     return [line1, line2];
//   } if (line1.pageIndex < line2.pageIndex) {
//     return [line2, line1];
//   }

//   if (line1.sceneIndex > line2.sceneIndex) {
//     return [line1, line2];
//   } if (line1.sceneIndex < line2.sceneIndex) {
//     return [line2, line1];
//   }

//   if (line1.sectionIndex > line2.sectionIndex) {
//     return [line1, line2];
//   }

//   return [line2, line1];
// };

export default function renderSwitch(content, currIndices, lineIndices, sceneInfo, stuff) {
  // const [higher, lower] = determineOrderOfLines(currIndices, lineIndices);

  // let lineDifference = 99;

  // try {
  //   const lowerSceneLength = stuff.script[lower.pageIndex][CONTENT][lower.sceneIndex][SCENE].length;

  //   if (higher.pageIndex === lower.pageIndex) {
  //     if (higher.sceneIndex === lower.sceneIndex) {
  //       lineDifference = higher.sectionIndex - lower.sectionIndex;
  //     } else if (higher.sceneIndex - lower.sceneIndex === 1) {
  //       lineDifference = lowerSceneLength - lower.sectionIndex + higher.sectionIndex;
  //     }
  //   } else if (higher.pageIndex - lower.pageIndex === 1) {
  //     if (
  //       lower.sceneIndex === stuff.script[lower.pageIndex][CONTENT].length - 1
  //       && higher.sceneIndex === 0
  //     ) {
  //       lineDifference = lowerSceneLength - lower.sectionIndex + higher.sectionIndex;
  //     }
  //   }
  // } catch (err) {
  //   console.log('err', err);
  // }

  // lineDifference = Math.abs(lineDifference);
  const bold = true;
  // const bold = lineDifference <= 2;
  const paddingLeft = '10vw';
  const paddingRight = '10vw';
  const fontSize = bold ? '23px' : '23px';
  // const fontWeight = bold ? `${900 - (lineDifference * 100)}` : 'normal';
  const fontWeight = 900;
  const color = 'white';
  // const color = bold
  // ? `rgb(255, 255, ${lineDifference * 70})`
  // : 'white';
  const borderSettings = {
    textShadow: '0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black',
    lineHeight: '90%',
  };

  const si = sceneInfo && (
    <p
      // ref={bold && lineRef}
      className={bold ? 'focusHere' : 'others '}
      key={`action${currIndices.pageIndex}${currIndices.sectionIndex}${lineIndices.sceneIndex}${currIndices.sceneIndex}`}
      style={{
        paddingLeft,
        paddingRight,
        textAlignLast: 'start',
        textAlign: 'start',
        fontFamily: 'Courier',
        alignSelf: 'start',
        fontWeight,
        fontSize,
        lineHeight: color,
        ...borderSettings,
      }}
    >
      {sceneInfo[REGION] ? sceneInfo[REGION] : ''} 
      {' '}
      {sceneInfo[LOCATION] ? sceneInfo[LOCATION] : ''}
      {' '}
      {sceneInfo[TIME] ? sceneInfo[TIME].join(' - ') : ''}
    </p>
  );
  switch (content[TYPE]) {
    case 'ACTION':
      return [
        si,
        <div
          id={`action${currIndices.pageIndex}-${currIndices.sceneIndex}-${currIndices.sectionIndex}`}
        >
          {content[CONTENT].map((action) => [
            <p
              // ref={bold && lineRef}
              className={bold ? 'focusHere' : 'others '}
              key={`action${action.slice(10)}${currIndices.pageIndex}${currIndices.sectionIndex}${
                lineIndices.sceneIndex
              }${currIndices.sceneIndex}`}
              style={{
                marginTop: '20px',
                paddingLeft,
                paddingRight,
                textAlignLast: 'start',
                textAlign: 'start',
                fontFamily: 'Courier',
                alignSelf: 'start',
                fontWeight,
                fontSize,
                color,
                ...borderSettings,
              }}
            >
              {action}
            </p>,
          ])}
        </div>,
      ];
    case 'CHARACTER':
      return [
        si,
        <section
          id={`action${currIndices.pageIndex}-${currIndices.sceneIndex}-${currIndices.sectionIndex}`}
          className={bold ? 'focusHere' : 'others '}
          style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateRows: 'auto auto',
            justifyItems: 'center',
            fontFamily: 'Courier',
            fontSize,
            fontWeight,
            color,
            ...borderSettings,
          }}
        >
          <p style={{ margin: 0, textAlign: 'center' }}>
            {content[CONTENT][CHARACTER]}
            {' '}
            {content[CONTENT][MODIFIER] && `(${content[CONTENT][MODIFIER]})`}
          </p>
          {content[CONTENT][DIALOGUE].map((dialogue) => (
            <p
              key={`dialogue${dialogue.slice(0, 10)}${currIndices.pageIndex}${
                currIndices.sectionIndex
              }${lineIndices.sceneIndex}${currIndices.sceneIndex}`}
              style={{ width: '15vw', margin: 0, textAlign: 'left' }}
            >
              {dialogue}
            </p>
          ))}
        </section>,
      ];
    case 'DUAL_DIALOGUE':
      return [
        si,
        <section
          id={`action${currIndices.pageIndex}-${currIndices.sceneIndex}-${currIndices.sectionIndex}`}
          style={{
            marginTop: '20px',
            paddingLeft,
            paddingRight,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Courier',
            fontSize,
            fontWeight,
            color,
            ...borderSettings,
          }}
        >
          <div
            style={{
              width: '50%',
              display: 'grid',
              gridRow: '1fr 1fr',
              justifyItems: 'center',
              alignContent: 'start',
              alignItems: 'center',

              marginRight: '2vw',
            }}
          >
            <section>{content[CONTENT].character1.character}</section>
            {content[CONTENT].character1.dialogue.map((dialogue) => (
              <section>{dialogue}</section>
            ))}
          </div>

          <div
            style={{
              width: '50%',
              display: 'grid',
              gridRow: '1fr 1fr',
              justifyItems: 'center',
              alignContent: 'start',
              alignItems: 'center',
            }}
          >
            <section>{content[CONTENT].character2.character}</section>
            <section>{content[CONTENT].character2.dialogue}</section>
          </div>
        </section>,
      ];
    case 'TRANSITION':
      return [
        si,
        <p
          id={`action${currIndices.pageIndex}-${currIndices.sceneIndex}-${currIndices.sectionIndex}`}
          style={{
            paddingRight,
            paddingLeft: '40vw',
            fontFamily: 'Courier',
            fontSize,
            fontWeight,
            color,
            alignSelf: 'flex-end',
            ...borderSettings,
          }}
        >
          {content[CONTENT]}
        </p>,
      ];
    case 'FIRST_PAGES':
      return content[CONTENT].map((page) => (
        <p
          key={`first_pages${page.text.slice(0, 10)}`}
          style={{
            paddingLeft,
            paddingRight,
            textAlignLast: 'start',
            textAlign: 'start',
            fontFamily: 'Courier',
            fontSize,
            alignSelf: 'start',
            ...borderSettings,
          }}
        >
          {page.text}
        </p>
      ));
    default:
      break;
  }
}
