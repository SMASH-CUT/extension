
import styled from 'styled-components';

const Button = styled.button`
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
    background: #090c0c;
  }

  transition-delay: ${(props) => (props.fadeInToggleButton ? 0 : '0s')};
  transition-duration: 0.3s;
  opacity: ${(props) => (props.fadeInToggleButton ? 1 : 0)}; 
`;

export default Button;
