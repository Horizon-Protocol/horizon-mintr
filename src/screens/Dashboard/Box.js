import styled from 'styled-components';

const Box = styled.div`
  border-radius: 2px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  width: ${props => (props.full ? '100%' : '440px')};
`;

export const BoxInner = styled.div`
  padding: 24px;
  width: 100%;
`;

export const BoxHeading = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colorStyles.borders};
`;

export default Box;
