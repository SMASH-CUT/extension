import styled from 'styled-components';

const PopupButton = styled.button`
  /* Adapt the colors based on primary prop */
  background: none;
  color: white;
  font-size: 1.25em;
  padding: 1.1em 1.1em;
  border-radius: 4px;
  border-color: white;
  border-style: solid;
  border-width: 1px;
  font-weight: bolder;
  &:hover {
    cursor: pointer;
    background: rgb(54, 54, 54);
  }
`;

export default PopupButton;
