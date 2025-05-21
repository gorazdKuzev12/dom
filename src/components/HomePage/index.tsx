"use client";

import { useState, useTransition } from "react";
import Select, { StylesConfig, ActionMeta, SingleValue, MultiValue, CSSObjectWithLabel } from "react-select";
import { FiPlusSquare, FiUserPlus, FiGlobe } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  BurgerButton,
  Input,
  LinksDesktop,
  Logo,
  MobileMenu,
  Overlay,
  SearchBar,
  SearchButton,
  ToggleButton,
  ToggleGroup,
  TopBar,
  TopLink,
  Wrapper,
} from "@/styles/mainPage/styles";
import styled from "styled-components";

interface SelectStylesProps {
  isFocused?: boolean;
  isSelected?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

interface City {
  id: string;
  name: string;
  name_mk: string;
  name_en: string;
  name_sq: string;
}

interface HomePageClientProps {
  initialCities: City[];
}

type StylesBase = Record<string, unknown>;

const customSelectStyles: StylesConfig<SelectOption> = {
  control: (base: CSSObjectWithLabel, state: SelectStylesProps) => ({
    ...base,
    borderRadius: "10px",
    border: "1px solid #ddd",
    padding: "0.3rem 0.5rem",
    fontSize: "1rem",
    minWidth: "200px",
    boxShadow: state.isFocused ? "0 0 0 1px #0c4240" : "none",
    "&:hover": {
      borderColor: "#0c4240",
    },
    "@media (max-width: 480px)": {
      width: "360px",
      minWidth: "0",
    },
  }),
  option: (base: CSSObjectWithLabel, state: SelectStylesProps) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0c4240"
      : state.isFocused
      ? "#f2f2f2"
      : "white",
    color: state.isSelected ? "white" : "#333",
    padding: "0.6rem 1.3rem",
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 9999,
  }),
  menuPortal: (base: CSSObjectWithLabel) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#888",
  }),
};

// Custom styles for language selector
const languageSelectStyles = {
  ...customSelectStyles,
  control: (base) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: "8px",
    border: "1px solid #ccc",
    padding: "0.1rem 0.3rem",
    fontSize: "0.6rem",
    minWidth: "unset",
    minHeight: "unset",
    width: "85px",

    "@media (max-width: 480px)": {
      width: "80px",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: "#111",
  }),
  menu: (base) => ({
    ...base,
    width: "85px",
  }),
};

// Language options
const languages = [
  { value: "mk", label: "MK" },
  { value: "en", label: "EN" },
  { value: "sq", label: "AL" },
];

const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0.3rem;
  border-radius: 6px;
  background: #f5f9f9;
  transition: all 0.2s ease;

  svg {
    color: #0c4240;
    width: 14px;
    height: 14px;
    margin-right: 0.1rem;
  }
`;

const LanguageButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.15rem 0.3rem;
  font-size: 0.75rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#0c4240' : '#666'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 3px;

  &:hover {
    background: ${props => props.active ? 'transparent' : '#e7f1f1'};
    color: #0c4240;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function HomePageClient({ initialCities }: HomePageClientProps) {
  const t = useTranslations("Navigation");
  const searchT = useTranslations("Search");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<SelectOption | null>(null);
  const [searchMode, setSearchMode] = useState("buy");
  const [open, setOpen] = useState(false);

  // Property type options
  const propertyTypeOptions: SelectOption[] = [
    { value: "apartments", label: searchT("apartments") },
    { value: "homes", label: searchT("homes") },
    { value: "rooms", label: searchT("rooms") },
    { value: "villas", label: searchT("villas") },
    { value: "offices", label: searchT("offices") },
    { value: "garages", label: searchT("garages") },
    { value: "storageRooms", label: searchT("storageRooms") },
    { value: "commercialProperties", label: searchT("commercialProperties") },
    { value: "land", label: searchT("land") },
    { value: "buildings", label: searchT("buildings") },
  ];

  // City options
  const cityOptions: SelectOption[] = initialCities.map(city => ({
    value: city.id,
    label: getCityName(city)
  }));

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      const stripped = pathname.replace(`/${locale}`, "");
      router.push(`/${newLocale}${stripped}`);
    });
  };

  const handleCityChange = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => {
    setSelectedCity(newValue as SelectOption | null);
  };

  const handlePropertyTypeChange = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => {
    setSelectedPropertyType(newValue as SelectOption | null);
  };

  const handleSearch = () => {
    if (!selectedCity || !selectedCity.value) return; // nothing chosen -> stay put

    // keep the current locale prefix in the URL (mk / en / sq)
    router.push(`/${locale}/map/skopje`);
  };

  const handleSearchModeChange = (mode: string) => {
    setSearchMode(mode);
  };

  function getCityName(city: City): string {
    if (locale === "mk") return city.name_mk;
    if (locale === "en") return city.name_en;
    if (locale === "sq") return city.name_sq;
    return city.name_en; // fallback to English
  }

  const NavLinks = (
    <>
      <TopLink href="/post-property">
        <FiPlusSquare size={18} />
        <span>{t("postProperty")}</span>
      </TopLink>

      <TopLink href="/find-roommate">
        <FiUserPlus size={18} />
        <span>{t("roommates")}</span>
      </TopLink>
    </>
  );

  return (
    <Wrapper>
      <TopBar>
        {/* 1️⃣ Desktop links */}
        <LinksDesktop>{NavLinks}</LinksDesktop>

        {/* 2️⃣ Language buttons – always visible */}
        <LanguageContainer>
          <FiGlobe size={14} />
          {languages.map((lang) => (
            <LanguageButton
              key={lang.value}
              onClick={() => handleLocaleChange(lang.value)}
              active={locale === lang.value}
              disabled={isPending}
            >
              {lang.label}
            </LanguageButton>
          ))}
        </LanguageContainer>

        {/* 3️⃣ Hamburger (mobile only) */}
        <BurgerButton
          aria-label="Menu"
          className={open ? "open" : ""}
          onClick={() => setOpen(!open)}
        >
          <span />
        </BurgerButton>
      </TopBar>

      {/* 4️⃣ Slide-down mobile menu */}
      <MobileMenu open={open}>{NavLinks}</MobileMenu>
      <Overlay>
        <Logo>dom.mk</Logo>
        <SearchBar>
          <ToggleGroup>
            <ToggleButton
              active={searchMode === "buy"}
              onClick={() => handleSearchModeChange("buy")}
            >
              {searchT("buy")}
            </ToggleButton>
            <ToggleButton
              active={searchMode === "rent"}
              onClick={() => handleSearchModeChange("rent")}
            >
              {searchT("rent")}
            </ToggleButton>
          </ToggleGroup>

          {/* Property type dropdown with React Select */}

          <Select
            styles={customSelectStyles}
            value={selectedPropertyType}
            onChange={handlePropertyTypeChange}
            options={propertyTypeOptions}
            placeholder={searchT("chooseLocal")}
            className="city-select"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            menuPosition="absolute"
            menuShouldBlockScroll={true}
          />

          {/* City selection dropdown with React Select */}
          <Select
            styles={customSelectStyles}
            value={selectedCity}
            onChange={handleCityChange}
            options={cityOptions}
            placeholder={searchT("choose")}
            className="city-select"
            menuPortalTarget={
              typeof window !== "undefined" ? document.body : null
            }
            menuPosition="absolute"
            menuShouldBlockScroll={true}
          />

          <SearchButton onClick={handleSearch}>
            {searchT("searchButton")}
          </SearchButton>
        </SearchBar>
      </Overlay>
    </Wrapper>
  );
}
