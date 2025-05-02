"use client";

import styled from "styled-components";
import { FiPlusSquare, FiUser } from "react-icons/fi"; // optional for login icon
import {
  Dropdown,
  Input,
  LanguageSelect,
  Logo,
  Overlay,
  SearchBar,
  SearchButton,
  ToggleButton,
  ToggleGroup,
  TopBar,
  TopLink,
  Wrapper,
} from "./styles";

export default function HomePage() {
  return (
    <Wrapper>
      <TopBar>
        <TopLink href="/post-property">
          <FiPlusSquare size={18} />
          Post your bookings
        </TopLink>
        <LanguageSelect>
          <option value="en">🇬🇧 English</option>
          <option value="mk">🇲🇰 Macedonian</option>
        </LanguageSelect>
      </TopBar>
      <Overlay>
        <Logo>dom.mk</Logo>
        <SearchBar>
          <ToggleGroup>
            <ToggleButton active>Buy</ToggleButton>
            <ToggleButton>Rent</ToggleButton>
          </ToggleGroup>
          <Dropdown>
            <option>Apartments</option>
            <option>Homes</option>
            <option>Offices</option>
          </Dropdown>
          <Input placeholder="Search in Macedonia" />
          <SearchButton>Search</SearchButton>
        </SearchBar>
      </Overlay>
    </Wrapper>
  );
}
