import React from 'react';
import styled from 'styled-components';
import { LIGHT_GRAY2, PRIMARY_BLUE2 } from '../../Common/colors';
import { Typography } from '@mui/material';

const StyledPanel = styled.div`
  width: 150px;
  height: ${props => props.height || '95vh'};
  background: ${props => props.background || LIGHT_GRAY2};
  border-radius: ${props => props.borderRadius || '8px'};
  box-shadow: ${props => props.boxShadow || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  overflow: ${props => props.overflow || 'auto'};
  border: ${props => props.border || `1px solid #E5E7EB`};
  padding: ${props => props.padding || '8px'};
  ${props => props.customStyles};

  @media (min-width: 1024px) {
    width: ${props => props.width || '240px'};
  }
`;

const ContentSection = styled.div`
  margin-bottom: 24px;
`;

const QuickLinksSection = styled.div``;

const NuralActivityPanel2 = ({ 
  children,
  quickLinksContent,
  width,
  height,
  background,
  borderRadius,
  boxShadow,
  overflow,
  border,
  padding,
  style,
  ...otherProps 
}) => {
  return (
    <StyledPanel
      width={width}
      height={height}
      background={background}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      overflow={overflow}
      border={border}
      padding={padding}
      customStyles={style}
      {...otherProps}
    >
      <Typography sx={
        {
          fontFamily: "Manrope",
          fontSize: "14px",
          fontWeight: "700",
          lineHeight: "19.12px",
          letterSpacing: "0%",
          color: PRIMARY_BLUE2,
          margin:"10px 0px 15px 5px"
        }
      } >Activity Panel</Typography>
      <ContentSection>
        {children}
      </ContentSection>
      <QuickLinksSection>
        {quickLinksContent}
      </QuickLinksSection>
    </StyledPanel>
  );
};

export default NuralActivityPanel2; 