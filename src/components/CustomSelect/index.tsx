import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

// Styled components for custom select
const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.8rem 1.3rem;
  font-size: 1rem;
  background: #fff;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:after {
    content: "▼";
    font-size: 0.8rem;
    margin-left: 8px;
  }
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 5px;
  z-index: 1000;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const Option = styled.div`
  padding: 0.8rem 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  ${(props) =>
    props.selected &&
    `
    background-color: #eee;
    font-weight: bold;
  `}
`;

// Custom Select Component
const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || "");
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleOptionClick = (option) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    if (onChange) {
      const event = { target: { value: option.value } };
      onChange(event);
    }
  };

  // Find selected option label
  const getSelectedLabel = () => {
    const option = options.find((opt) => opt.value === selectedOption);
    return option ? option.label : placeholder || "Select an option";
  };

  return (
    <SelectContainer ref={selectRef}>
      <SelectButton type="button" onClick={() => setIsOpen(!isOpen)}>
        {getSelectedLabel()}
      </SelectButton>

      <OptionsContainer isOpen={isOpen}>
        {options.map((option, index) => (
          <Option
            key={index}
            selected={option.value === selectedOption}
            onClick={() => handleOptionClick(option)}
          >
            {option.label}
          </Option>
        ))}
      </OptionsContainer>
    </SelectContainer>
  );
};

export default CustomSelect;
