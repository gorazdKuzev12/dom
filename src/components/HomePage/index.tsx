"use client";

import { useState, useTransition } from "react";
import Select from "react-select";
import { FiPlusSquare, FiUserPlus } from "react-icons/fi";
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
  LanguageButton,
  LanguageContainer,
} from "../../../src/styles/mainPage/styles.tsx";

const customSelectStyles = {
  control: (base, state) => ({
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
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0c4240"
      : state.isFocused
      ? "#f2f2f2"
      : "white",
    color: state.isSelected ? "white" : "#333",
    padding: "0.6rem 1.3rem",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base) => ({
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

export default function HomePageClient({ initialCities }) {
  const t = useTranslations("Navigation");
  const searchT = useTranslations("Search");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [searchMode, setSearchMode] = useState("buy");
  const [open, setOpen] = useState(false);

  // Property type options
  const propertyTypeOptions = [
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

  // Format city options based on locale
  const cityOptions =
    initialCities?.map((city) => ({
      value: city.slug,
      label: getCityName(city),
    })) || [];

  // Add placeholder option for cities
  const cityOptionsWithPlaceholder = [
    { value: "", label: searchT("choose"), isDisabled: true },
    ...cityOptions,
  ];

  const handleLocaleChange = (newLocale) => {
    startTransition(() => {
      // Get the path without the locale prefix
      const pathWithoutLocale = pathname.replace(`/${locale}`, "");

      // Navigate to the new locale path
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  // Handle property type selection
  const handlePropertyTypeChange = (selectedOption) => {
    setSelectedPropertyType(selectedOption);
  };

  const handleSearch = () => {
    if (!selectedCity || !selectedCity.value) return; // nothing chosen -> stay put

    // keep the current locale prefix in the URL (mk / en / sq)
    router.push(`/${locale}/map/${selectedCity.value}`);
  };

  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
  };

  // Get city name based on current locale
  function getCityName(city) {
    if (locale === "mk") return city.name_mk;
    if (locale === "en") return city.name_en;
    if (locale === "sq") return city.name_sq;
    return city.name_en; // Fallback to English
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
            options={cityOptionsWithPlaceholder}
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
