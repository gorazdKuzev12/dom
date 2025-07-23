"use client";

import { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface City {
  id: string;
  name_en: string;
  name_mk: string;
  name_sq: string;
  slug: string;
}

interface Municipality {
  id: string;
  name_en: string;
  name_mk: string;
  name_sq: string;
  isPopular?: boolean;
  averagePrice?: number;
  image?: string;
  propertyCount?: number;
}

interface PropertyFiltersProps {
  cities?: City[];
  municipalities?: Municipality[];
  currentCitySlug?: string;
  currentMunicipalitySlug?: string;
}

interface FilterState {
  listingType: string;
  sortOption: string;
  propertyType: string;
  priceMin: string;
  priceMax: string;
  sizeMin: string;
  sizeMax: string;
  bedrooms: string[];
  bathrooms: string[];
  condition: string[];
  specificDetails: string[];
  floor: string[];
  listingDate: string;
  city: string;
  municipality: string;
}

export default function PropertyFilters({
  cities = [],
  municipalities = [],
  currentCitySlug = "",
  currentMunicipalitySlug = "",
}: PropertyFiltersProps = {}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract transaction and property type from URL path
  const getUrlParams = () => {
    const pathParts = pathname.split('/');
    const locale = pathParts[1];
    const transaction = pathParts[2]; // buy/rent
    const type = pathParts[3]; // apartments/houses/etc
    return { locale, transaction, type };
  };

  const { transaction: urlTransaction, type: urlType } = getUrlParams();

  // Filter states - NO DEFAULT VALUES, extract from URL only
  const [listingType, setListingType] = useState<FilterState["listingType"]>(urlTransaction || "");
  const [sortOption, setSortOption] = useState<FilterState["sortOption"]>("");
  const [propertyType, setPropertyType] = useState<FilterState["propertyType"]>(urlType || "");
  const [priceMin, setPriceMin] = useState<FilterState["priceMin"]>("");
  const [priceMax, setPriceMax] = useState<FilterState["priceMax"]>("");
  const [sizeMin, setSizeMin] = useState<FilterState["sizeMin"]>("");
  const [sizeMax, setSizeMax] = useState<FilterState["sizeMax"]>("");
  const [bedrooms, setBedrooms] = useState<FilterState["bedrooms"]>([]); // No default selection
  const [bathrooms, setBathrooms] = useState<FilterState["bathrooms"]>([]);
  const [condition, setCondition] = useState<FilterState["condition"]>([]);
  const [specificDetails, setSpecificDetails] = useState<FilterState["specificDetails"]>([]);
  const [floor, setFloor] = useState<FilterState["floor"]>([]);
  const [listingDate, setListingDate] = useState<FilterState["listingDate"]>("");
  const [city, setCity] = useState<FilterState["city"]>(currentCitySlug);
  const [municipality, setMunicipality] = useState<FilterState["municipality"]>(currentMunicipalitySlug);

  // Format price with currency symbol and thousands separators
  const formatPrice = (value: string): string => {
    if (!value) return "";
    if (parseInt(value) < 10) {
      return `${value}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(parseInt(value));
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (searchParams) {
      // Only override transaction/type if explicitly set in search params, otherwise keep URL values
      const searchListingType = searchParams.get("listingType");
      const searchPropertyType = searchParams.get("propertyType");
      
      if (searchListingType) setListingType(searchListingType);
      if (searchPropertyType) setPropertyType(searchPropertyType);
      
      setSortOption(searchParams.get("sort") || "");
      setPriceMin(searchParams.get("priceMin") || "");
      setPriceMax(searchParams.get("priceMax") || "");
      setSizeMin(searchParams.get("sizeMin") || "");
      setSizeMax(searchParams.get("sizeMax") || "");
      setBedrooms(
        searchParams.get("bedrooms")?.split(",").filter(Boolean) || []
      );
      setBathrooms(
        searchParams.get("bathrooms")?.split(",").filter(Boolean) || []
      );
      setCondition(
        searchParams.get("condition")?.split(",").filter(Boolean) || []
      );
      setSpecificDetails(
        searchParams.get("specificDetails")?.split(",").filter(Boolean) || []
      );
      setFloor(searchParams.get("floor")?.split(",").filter(Boolean) || []);
      setListingDate(searchParams.get("listingDate") || "");
      setCity(searchParams.get("city") || currentCitySlug);
      setMunicipality(searchParams.get("municipality") || currentMunicipalitySlug);
    }
  }, [searchParams, urlTransaction, urlType, currentCitySlug, currentMunicipalitySlug]);

  // Create a function to construct params object with current state values
  const createParamsWithCurrentState = (updatedValues = {}) => {
    const currentValues = {
      listingType,
      sort: sortOption,
      propertyType,
      priceMin,
      priceMax,
      sizeMin,
      sizeMax,
      bedrooms,
      bathrooms,
      condition,
      specificDetails,
      floor,
      listingDate,
      city,
      municipality,
      ...updatedValues,
    };

    const params = new URLSearchParams();

    if (currentValues.listingType)
      params.set("listingType", currentValues.listingType);
    if (currentValues.sort) params.set("sort", currentValues.sort);
    if (currentValues.propertyType)
      params.set("propertyType", currentValues.propertyType);
    if (currentValues.priceMin) params.set("priceMin", currentValues.priceMin);
    if (currentValues.priceMax) params.set("priceMax", currentValues.priceMax);
    if (currentValues.sizeMin) params.set("sizeMin", currentValues.sizeMin);
    if (currentValues.sizeMax) params.set("sizeMax", currentValues.sizeMax);
    if (currentValues.bedrooms.length)
      params.set("bedrooms", currentValues.bedrooms.join(","));
    if (currentValues.bathrooms.length)
      params.set("bathrooms", currentValues.bathrooms.join(","));
    if (currentValues.condition.length)
      params.set("condition", currentValues.condition.join(","));
    if (currentValues.specificDetails.length)
      params.set("specificDetails", currentValues.specificDetails.join(","));
    if (currentValues.floor.length)
      params.set("floor", currentValues.floor.join(","));
    if (currentValues.listingDate)
      params.set("listingDate", currentValues.listingDate);
    if (currentValues.city && currentValues.city !== currentCitySlug)
      params.set("city", currentValues.city);
    if (currentValues.municipality && currentValues.municipality !== currentMunicipalitySlug)
      params.set("municipality", currentValues.municipality);

    return params;
  };

  // Apply filters function with updated param construction
  const applyFilters = (updatedValues = {}) => {
    const params = createParamsWithCurrentState(updatedValues);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle transaction type change - this should change the URL path
  const handleListingTypeChange = (value: FilterState["listingType"]): void => {
    setListingType(value);
    
    // For transaction type, we need to update the URL path, not just query params
    const pathParts = pathname.split('/');
    const locale = pathParts[1];
    const currentType = pathParts[3];
    const city = pathParts[4];
    const municipalityPart = pathParts.slice(5).join('/'); // municipality/[name]/listings if exists
    
    const newPath = `/${locale}/${value}/${currentType}/${city}${municipalityPart ? '/' + municipalityPart : ''}`;
    const params = createParamsWithCurrentState({ listingType: value });
    router.push(`${newPath}?${params.toString()}`, { scroll: false });
  };

  // Handle property type change - this should also change the URL path  
  const handlePropertyTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    setPropertyType(value);
    
    // Map frontend property type to URL-friendly format
    const propertyTypeMap: Record<string, string> = {
      "APARTMENT": "apartments",
      "HOUSE": "homes", 
      "ROOM": "rooms",
      "VILLA": "villas",
      "STUDIO": "studio",
      "OFFICE": "offices",
      "GARAGE": "garages",
      "STORAGE_ROOM": "storage-rooms",
      "COMMERCIAL": "commercial-properties",
      "LAND": "land",
      "BUILDING": "buildings",
    };
    
    const urlPropertyType = propertyTypeMap[value] || value.toLowerCase();
    
    const pathParts = pathname.split('/');
    const locale = pathParts[1];
    const currentTransaction = pathParts[2];
    const city = pathParts[4];
    const municipalityPart = pathParts.slice(5).join('/');
    
    const newPath = `/${locale}/${currentTransaction}/${urlPropertyType}/${city}${municipalityPart ? '/' + municipalityPart : ''}`;
    const params = createParamsWithCurrentState({ propertyType: value });
    router.push(`${newPath}?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    setSortOption(value);
    applyFilters({ sort: value });
  };

  const handlePriceMinChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setPriceMin(value);
    }
  };

  const handlePriceMaxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setPriceMax(value);
    }
  };

  const handleSizeMinChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setSizeMin(value);
    }
  };

  const handleSizeMaxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setSizeMax(value);
    }
  };

  const handlePriceMinBlur = () => {
    applyFilters({ priceMin });
  };

  const handlePriceMaxBlur = () => {
    applyFilters({ priceMax });
  };

  const handleSizeMinBlur = () => {
    applyFilters({ sizeMin });
  };

  const handleSizeMaxBlur = () => {
    applyFilters({ sizeMax });
  };

  const toggleSelection = (
    value: string,
    state: string[],
    setState: (value: string[]) => void,
    paramName: keyof FilterState
  ): void => {
    let newState: string[];
    if (state.includes(value)) {
      newState = state.filter((item: string) => item !== value);
    } else {
      newState = [...state, value];
    }
    setState(newState);

    const updatedValues: Partial<Record<keyof FilterState, string[]>> = {};
    updatedValues[paramName] = newState;
    applyFilters(updatedValues);
  };

  const handleDateChange = (value: FilterState["listingDate"]): void => {
    setListingDate(value);
    applyFilters({ listingDate: value });
  };

  // Helper function to get localized name
  const getLocalizedName = (item: City | Municipality, locale: string = 'en'): string => {
    switch (locale) {
      case 'mk':
        return item.name_mk;
      case 'sq':
        return item.name_sq;
      default:
        return item.name_en;
    }
  };

  // Handle city change - go directly to first municipality of that city
  const handleCityChange = async (e: ChangeEvent<HTMLSelectElement>): Promise<void> => {
    const value = e.target.value;
    setCity(value);
    setMunicipality(''); // Clear municipality when city changes
    
    const pathParts = pathname.split('/');
    const locale = pathParts[1];
    const currentTransaction = pathParts[2];
    const currentType = pathParts[3];
    
    try {
      // Import Apollo client and queries
      const { getClient } = await import('@/lib/client');
      const { GET_MUNICIPALITIES_BY_CITY_NAME } = await import('@/lib/queries');
      
      // Fetch municipalities for the selected city
      const client = getClient();
      const { data } = await client.query({
        query: GET_MUNICIPALITIES_BY_CITY_NAME,
        variables: { name: value }
      });
      
      if (data?.municipalitiesByCityName && data.municipalitiesByCityName.length > 0) {
        // Get the first municipality
        const firstMunicipality = data.municipalitiesByCityName[0];
        
        // Create slug from municipality name
        const createSlug = (text: string): string => {
          return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
        };
        
        const municipalitySlug = createSlug(firstMunicipality.name_en);
        setMunicipality(municipalitySlug);
        
        // Navigate directly to the first municipality's listings
        const newPath = `/${locale}/${currentTransaction}/${currentType}/${value}/${municipalitySlug}/listings`;
        const params = createParamsWithCurrentState({ city: value, municipality: municipalitySlug });
        router.push(`${newPath}?${params.toString()}`, { scroll: false });
      } else {
        // Fallback: navigate to city page if no municipalities found
        const newPath = `/${locale}/${currentTransaction}/${currentType}/${value}`;
        router.push(newPath, { scroll: false });
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      // Fallback: navigate to city page on error
      const newPath = `/${locale}/${currentTransaction}/${currentType}/${value}`;
      router.push(newPath, { scroll: false });
    }
  };

  // Handle municipality change - this should update the URL path
  const handleMunicipalityChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    setMunicipality(value);
    
    const pathParts = pathname.split('/');
    const locale = pathParts[1];
    const currentTransaction = pathParts[2];
    const currentType = pathParts[3];
    const currentCity = pathParts[4];
    
    const newPath = `/${locale}/${currentTransaction}/${currentType}/${currentCity}/${value}/listings`;
    const params = createParamsWithCurrentState({ municipality: value });
    router.push(`${newPath}?${params.toString()}`, { scroll: false });
  };

  return (
    <FilterContainer>
      <TopOptions>
        <ListingTypeToggle>
          <ToggleButton
            $active={listingType === "buy"}
            onClick={() => handleListingTypeChange("buy")}
          >
            {t("Search.buy")}
          </ToggleButton>
          <ToggleButton
            $active={listingType === "rent"}
            onClick={() => handleListingTypeChange("rent")}
          >
            {t("Search.rent")}
          </ToggleButton>
        </ListingTypeToggle>

        {/* City and Municipality selects */}
        <LocationSelects>
          <SelectInput value={city} onChange={handleCityChange}>
            <option value="">All Cities</option>
            {cities.map((cityItem) => (
              <option key={cityItem.id} value={cityItem.slug}>
                {getLocalizedName(cityItem, 'en')}
              </option>
            ))}
          </SelectInput>
          
          {/* Only show municipality filter if there are multiple municipalities */}
          {municipalities.length > 1 && (
            <SelectInput value={municipality} onChange={handleMunicipalityChange}>
              <option value="">All Areas</option>
              {municipalities.map((municipalityItem) => (
                <option key={municipalityItem.id} value={municipalityItem.name_en.toLowerCase()}>
                  {getLocalizedName(municipalityItem, 'en')}
                </option>
              ))}
            </SelectInput>
          )}
        </LocationSelects>

     
      </TopOptions>

      <FilterSection>
        <FilterTitle>{t("Filters.propertyType")}</FilterTitle>
        <SelectInput value={propertyType} onChange={handlePropertyTypeChange}>
          <option value="">{t("Filters.select")}</option>
          <option value="house">{t("Filters.house")}</option>
          <option value="apartment">{t("Filters.apartment")}</option>
          <option value="villa">{t("Filters.villa")}</option>
          <option value="office">{t("Filters.office")}</option>
          <option value="land">{t("Filters.land")}</option>
        </SelectInput>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.priceRange")}</FilterTitle>
        <RangeInputs>
          <TextInput
            type="number"
            placeholder={t("Filters.min")}
            value={priceMin}
            onChange={handlePriceMinChange}
            onBlur={handlePriceMinBlur}
          />
          <TextInput
            type="number"
            placeholder={t("Filters.max")}
            value={priceMax}
            onChange={handlePriceMaxChange}
            onBlur={handlePriceMaxBlur}
          />
        </RangeInputs>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.size")}</FilterTitle>
        <RangeInputs>
          <TextInput
            type="number"
            placeholder={t("Filters.min")}
            value={sizeMin}
            onChange={handleSizeMinChange}
            onBlur={handleSizeMinBlur}
          />
          <TextInput
            type="number"
            placeholder={t("Filters.max")}
            value={sizeMax}
            onChange={handleSizeMaxChange}
            onBlur={handleSizeMaxBlur}
          />
        </RangeInputs>
        <SizeDisplay>
          {sizeMin || "0"} - {sizeMax || t("Filters.max")} {t("Filters.squareMeters")}
        </SizeDisplay>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.features")}</FilterTitle>
        <CheckboxGroup>
          {[
            { value: "balcony", label: t("Filters.balcony") },
            { value: "heating", label: t("Filters.heating") },
            { value: "air-conditioning", label: t("Filters.airConditioning") },
            { value: "furnished", label: t("Filters.furnished") },
            { value: "elevator", label: t("Filters.elevator") },
            { value: "parking", label: t("Filters.parking") },
            { value: "garden", label: t("Filters.garden") },
            { value: "swimming-pool", label: t("Filters.swimmingPool") },
            { value: "internet", label: t("Filters.internet") },
            { value: "laundry", label: t("Filters.laundry") },
            { value: "dishwasher", label: t("Filters.dishwasher") },
            { value: "security", label: t("Filters.security") },
            { value: "storage", label: t("Filters.storage") },
            { value: "pet-friendly", label: t("Filters.petFriendly") },
            { value: "terrace", label: t("Filters.terrace") },
            { value: "fireplace", label: t("Filters.fireplace") },
            { value: "cable-tv", label: t("Filters.cableTV") },
            { value: "washing-machine", label: t("Filters.washingMachine") }
          ].map((item) => (
            <CheckboxItem key={`detail-${item.value}`}>
              <Checkbox
                type="checkbox"
                id={`detail-${item.value}`}
                checked={specificDetails.includes(item.value)}
                onChange={() =>
                  toggleSelection(
                    item.value,
                    specificDetails,
                    setSpecificDetails,
                    "specificDetails"
                  )
                }
              />
              <CheckboxLabel htmlFor={`detail-${item.value}`}>
                {item.label}
              </CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.condition")}</FilterTitle>
        <CheckboxGroup>
          {[
            { value: "new", label: t("Filters.new") },
            { value: "good", label: t("Filters.good") },
            { value: "needs_renovation", label: t("Filters.needsRenovation") },
            { value: "renovated", label: "Fully renovated" }
          ].map((item) => (
            <CheckboxItem key={`condition-${item.value}`}>
              <Checkbox
                type="checkbox"
                id={`condition-${item.value}`}
                checked={condition.includes(item.value)}
                onChange={() =>
                  toggleSelection(
                    item.value,
                    condition,
                    setCondition,
                    "condition"
                  )
                }
              />
              <CheckboxLabel htmlFor={`condition-${item.value}`}>
                {item.label}
              </CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.bedrooms")}</FilterTitle>
        <CheckboxGroup>
          {[1, 2, 3, 4, "5+"].map((num) => (
            <CheckboxItem key={`bedroom-${num}`}>
              <Checkbox
                type="checkbox"
                id={`bedroom-${num}`}
                checked={bedrooms.includes(num.toString())}
                onChange={() =>
                  toggleSelection(
                    num.toString(),
                    bedrooms,
                    setBedrooms,
                    "bedrooms"
                  )
                }
              />
              <CheckboxLabel htmlFor={`bedroom-${num}`}>{num}</CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.bathrooms")}</FilterTitle>
        <CheckboxGroup>
          {[1, 2, 3, "4+"].map((num) => (
            <CheckboxItem key={`bathroom-${num}`}>
              <Checkbox
                type="checkbox"
                id={`bathroom-${num}`}
                checked={bathrooms.includes(num.toString())}
                onChange={() =>
                  toggleSelection(
                    num.toString(),
                    bathrooms,
                    setBathrooms,
                    "bathrooms"
                  )
                }
              />
              <CheckboxLabel htmlFor={`bathroom-${num}`}>{num}</CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.floor")}</FilterTitle>
        <CheckboxGroup>
          {[
            { value: "ground", label: t("Filters.ground") },
            { value: "intermediate", label: t("Filters.middle") },
            { value: "top", label: t("Filters.top") },
            { value: "with_plan", label: "With floor plan" }
          ].map((item) => (
            <CheckboxItem key={`floor-${item.value}`}>
              <Checkbox
                type="checkbox"
                id={`floor-${item.value}`}
                checked={floor.includes(item.value)}
                onChange={() =>
                  toggleSelection(item.value, floor, setFloor, "floor")
                }
              />
              <CheckboxLabel htmlFor={`floor-${item.value}`}>
                {item.label}
              </CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <FilterTitle>{t("Filters.listingDate")}</FilterTitle>
        <RadioGroup>
          {[
            { value: "last_24h", label: t("Filters.today") },
            { value: "last_week", label: t("Filters.thisWeek") },
            { value: "last_month", label: t("Filters.thisMonth") }
          ].map((item) => (
            <RadioItem key={`date-${item.value}`}>
              <Radio
                type="radio"
                id={`date-${item.value}`}
                name="listingDate"
                value={item.value}
                checked={listingDate === item.value}
                onChange={() => handleDateChange(item.value)}
              />
              <RadioLabel htmlFor={`date-${item.value}`}>
                {item.label}
              </RadioLabel>
            </RadioItem>
          ))}
        </RadioGroup>
      </FilterSection>
    </FilterContainer>
  );
}

// Styled Components
const FilterContainer = styled.div`
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1a1a1a;
  letter-spacing: -0.2px;
`;

const TopOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const ListingTypeToggle = styled.div`
  display: flex;
  background: #f4f5f7;
  border-radius: 8px;
  overflow: hidden;
  height: 44px;
`;

const LocationSelects = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  > select {
    flex: 1;
    min-width: 140px;
  }
`;

interface ToggleButtonProps {
  $active: boolean;
}

const ToggleButton = styled.button<ToggleButtonProps>`
  flex: 1;
  padding: 12px 0;
  text-align: center;
  background: ${(props) => (props.$active ? "#0c4240" : "transparent")};
  color: ${(props) => (props.$active ? "#ffffff" : "#4b5563")};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#1a1a1a" : "#e5e7eb")};
  }
`;

const SortSelect = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 14px;
  color: #1a1a1a;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    border-color: #1a1a1a;
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }
`;

const SelectInput = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background-color: #ffffff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    border-color: #1a1a1a;
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }
`;

const RangeInputs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const TextInput = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background-color: #ffffff;
  transition: all 0.2s ease;
  width: 50%;
  &:focus {
    border-color: #1a1a1a;
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const PriceDisplay = styled.div`
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
`;

const SizeDisplay = styled.div`
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }
`;

const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #1a1a1a;
  border-radius: 4px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }
`;

const Radio = styled.input`
  margin-right: 8px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #1a1a1a;
`;

const RadioLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
`;
