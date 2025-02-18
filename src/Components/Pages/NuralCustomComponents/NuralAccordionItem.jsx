import React, { useState } from "react";
import styled from "styled-components";
import upArrow from "../../../../public/Icons/uparrow.svg";
import downArrow from "../../../../public/Icons/downarrow.svg";
import { BORDER_BOTTOM, DARK_PURPLE, MEDIUM_BLUE } from "../../Common/colors";

const StyledAccordion = styled.div`
  background: ${props => props.background || MEDIUM_BLUE};
  border-radius: ${props => props.borderRadius || '16px'};
  overflow: ${props => props.overflow || 'hidden'};
  margin-bottom: ${props => props.marginBottom || '16px'};
  ${props => props.customStyles};
`;

const Header = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent || 'space-between'};
  align-items: ${props => props.alignItems || 'center'};
  padding: ${props => props.padding || '20px'};
  cursor: ${props => props.cursor || 'pointer'};
  ${props => props.customStyles};
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.gap || '4px'};
  ${props => props.customStyles};
`;

const Title = styled.div`
  font-family: ${props => props.fontFamily || 'Manrope'};
  font-weight: ${props => props.fontWeight || '400'};
  font-size: ${props => props.fontSize || '10px'};
  line-height: ${props => props.lineHeight || '13.66px'};
  letter-spacing: ${props => props.letterSpacing || '4%'};
  color: ${props => props.color};
  ${props => props.customStyles};
`;

const ItemCount = styled.div`
  font-family: ${props => props.fontFamily || 'Manrope'};
  font-weight: ${props => props.fontWeight || '700'};
  font-size: ${props => props.fontSize || '20px'};
  line-height: ${props => props.lineHeight || '27.32px'};
  letter-spacing: ${props => props.letterSpacing || '0%'};
  color: ${props => props.color || DARK_PURPLE};
  ${props => props.customStyles};
`;

const ChevronIcon = styled.img`
  width: ${props => props.width || '24px'};
  height: ${props => props.height || '24px'};
  transition: ${props => props.transition || 'transform 0.3s ease'};
  ${props => props.customStyles};
`;

const Content = styled.div`
  padding: ${props => props.isOpen ? (props.openPadding || "0 20px 20px") : (props.closedPadding || "0 20px")};
  max-height: ${props => props.isOpen ? (props.openMaxHeight || "500px") : "0"};
  overflow: hidden;
  transition: ${props => props.transition || 'all 0.3s ease'};
  ${props => props.customStyles};
`;

const Divider = styled.div`
  height: ${props => props.height || '1.5px'};
  background: ${props => props.background || BORDER_BOTTOM};
  margin: ${props => props.margin || '12px 0'};
  color: ${props => props.color || BORDER_BOTTOM};
  ${props => props.customStyles};
`;

const ModelItem = styled.div`
  margin: ${props => props.margin || '20px 0'};
  ${props => props.customStyles};
`;

const ModelName = styled.div`
  font-family: ${props => props.fontFamily || 'Manrope'};
  font-weight: ${props => props.fontWeight || '400'};
  font-size: ${props => props.fontSize || '12px'};
  line-height: ${props => props.lineHeight || '14.08px'};
  letter-spacing: ${props => props.letterSpacing || '0%'};
  ${props => props.customStyles};
`;

const SchemeInfo = styled.div`
  font-family: ${props => props.fontFamily || 'Manrope'};
  font-weight: ${props => props.fontWeight || '700'};
  font-size: ${props => props.fontSize || '8px'};
  line-height: ${props => props.lineHeight || '10.93px'};
  letter-spacing: ${props => props.letterSpacing || '4%'};
  margin-top: ${props => props.marginTop || '4px'};
  ${props => props.customStyles};
`;

const NuralAccordionItem = ({ 
  title, 
  itemCount, 
  models,
  styles = {}, // Object containing style props for each component
  ...otherProps 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledAccordion {...styles.accordion} {...otherProps}>
      <Header onClick={() => setIsOpen(!isOpen)} {...styles.header}>
        <TitleSection {...styles.titleSection}>
          <Title {...styles.title}>{title}</Title>
          <ItemCount {...styles.itemCount}>{itemCount} Items</ItemCount>
        </TitleSection>
        <ChevronIcon
          src={isOpen ? upArrow : downArrow}
          alt={isOpen ? "collapse" : "expand"}
          {...styles.chevron}
        />
      </Header>
      <Content isOpen={isOpen} {...styles.content}>
        {models.map((model, index) => (
          <React.Fragment key={index}>
            {index === 0 && <Divider {...styles.divider} />}
            <ModelItem {...styles.modelItem}>
              <ModelName {...styles.modelName}>{model.name}</ModelName>
              <SchemeInfo {...styles.schemeInfo}>{model.schemeInfo}</SchemeInfo>
            </ModelItem>
            {index < models.length - 1 && <Divider {...styles.divider} />}
          </React.Fragment>
        ))}
      </Content>
    </StyledAccordion>
  );
};

export default NuralAccordionItem;
