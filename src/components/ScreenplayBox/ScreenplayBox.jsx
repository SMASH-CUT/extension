import React from 'react';
import styled from 'styled-components';
import { space, layout, position } from 'styled-system';

const Box = styled.section`
   box-sizing: border-box;

   ::-webkit-scrollbar {
      width: 0px;  /* Remove scrollbar space */
      background: transparent;  /* Optional: just make scrollbar invisible */
   }
   /* Optional: show position indicator in red */
   ::-webkit-scrollbar-thumb {
      background: #FF0000;
   }
   ${layout}
   ${space}
   ${position} 
  opacity: ${props => (props.temporaryScreenplayHide ? 0 : 1)}; 
  transition: opacity 0.3 linear 2s;

  /* -webkit-text-stroke: 1px black;
   -webkit-text-fill-color: white; */
  letter-spacing: 0px;
`;

export default Box;
