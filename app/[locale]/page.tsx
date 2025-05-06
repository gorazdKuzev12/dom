"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiPlusSquare, FiUser, FiUserPlus } from "react-icons/fi";
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
} from "../../src/styles/mainPage/styles";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

// Import the Apollo client
import { useQuery } from "@apollo/client";
import { GET_ALL_CITIES } from "@/lib/queries";

export default function HomePage() {
  const t = useTranslations("Navigation");
  const searchT = useTranslations("Search");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch cities using Apollo client
  const { loading, error, data } = useQuery(GET_ALL_CITIES);

  console.log(error);
  const handleLocaleChange = (e) => {
    const newLocale = e.target.value;
    startTransition(() => {
      // Get the path without the locale prefix
      const pathWithoutLocale = pathname.replace(`/${locale}`, "");

      // Navigate to the new locale path
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  // Handle city selection
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };
  const handleSearch = () => {
    if (!selectedCity) return; // nothing chosen -> stay put

    // keep the current locale prefix in the URL (mk / en / sq)
    router.push(`/${locale}/map/${selectedCity}`);
  };

  // Get city name based on current locale
  const getCityName = (city) => {
    if (locale === "mk") return city.name_mk;
    if (locale === "en") return city.name_en;
    if (locale === "sq") return city.name_sq;
    return city.name_en; // Fallback to English
  };

  return (
    <Wrapper>
      <TopBar>
        <TopLink href="/post-property">
          <FiPlusSquare size={18} />
          <span>{t("postProperty")}</span>
        </TopLink>
        <TopLink href="/find-roommate">
          <FiUserPlus size={18} />
          <span>Connect with roommates</span>
        </TopLink>

        <LanguageSelect
          value={locale}
          onChange={handleLocaleChange}
          disabled={isPending}
        >
          <option value="mk">Македонски</option>
          <option value="en">English</option>
          <option value="sq">Shqip</option>
        </LanguageSelect>
      </TopBar>
      <Overlay>
        <Logo>dom.mk</Logo>
        <SearchBar>
          <ToggleGroup>
            <ToggleButton active>{searchT("buy")}</ToggleButton>
            <ToggleButton>{searchT("rent")}</ToggleButton>
          </ToggleGroup>

          {/* Property type dropdown */}
          <Dropdown>
            <option>{searchT("apartments")}</option>
            <option>{searchT("homes")}</option>
            <option>{searchT("offices")}</option>
          </Dropdown>

          {/* City selection dropdown */}
          <Dropdown value={selectedCity} onChange={handleCityChange}>
            <option value="">Select</option>
            {loading ? (
              <option disabled>Loading cities...</option>
            ) : error ? (
              <option disabled>Error loading cities</option>
            ) : (
              data?.city?.map((city) => (
                <option key={city.id} value={city.slug}>
                  {getCityName(city)}
                </option>
              ))
            )}
          </Dropdown>

          <SearchButton onClick={handleSearch}>
            {searchT("searchButton")}
          </SearchButton>
        </SearchBar>
      </Overlay>
    </Wrapper>
  );
}
