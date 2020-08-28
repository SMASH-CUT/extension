import React from 'react';
import styled from 'styled-components';
import {
 space, layout, position
} from 'styled-system';

const Box = styled.section`
   box-sizing: border-box;

   ::-webkit-scrollbar {
      width: 0px;  /* Remove scrollbar space */
      background: transparent;  /* Optional: just make scrollbar invisible */
   }
   ${layout}
   ${space}
   ${position}
`;

export default Box;
