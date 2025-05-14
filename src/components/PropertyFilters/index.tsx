"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter states
  const [listingType, setListingType] = useState("buy");
  const [sortOption, setSortOption] = useState("recent");
  const [propertyType, setPropertyType] = useState("apartment");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [bedrooms, setBedrooms] = useState(["1"]);
  const [bathrooms, setBathrooms] = useState([]);
  const [condition, setCondition] = useState([]);
  const [specificDetails, setSpecificDetails] = useState([]);
  const [floor, setFloor] = useState([]);
  const [listingDate, setListingDate] = useState("");

  // Format price with currency symbol and thousands separators
  const formatPrice = (value) => {
    if (!value) return "";
    if (parseInt(value) < 10) {
      return `${value}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (searchParams) {
      setListingType(searchParams.get("listingType") || "buy");
      setSortOption(searchParams.get("sort") || "recent");
      setPropertyType(searchParams.get("propertyType") || "apartment");
      setPriceMin(searchParams.get("priceMin") || "");
      setPriceMax(searchParams.get("priceMax") || "");
      setSizeMin(searchParams.get("sizeMin") || "");
      setSizeMax(searchParams.get("sizeMax") || "");
      setBedrooms(
        searchParams.get("bedrooms")?.split(",").filter(Boolean) || ["1"]
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
    }
  }, [searchParams]);

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

    return params;
  };

  // Apply filters function with updated param construction
  const applyFilters = (updatedValues = {}) => {
    const params = createParamsWithCurrentState(updatedValues);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle change for various filter types with immediate application
  const handleListingTypeChange = (value) => {
    setListingType(value);
    applyFilters({ listingType: value });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    applyFilters({ sort: value });
  };

  const handlePropertyTypeChange = (e) => {
    const value = e.target.value;
    setPropertyType(value);
    applyFilters({ propertyType: value });
  };

  const handlePriceMinChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setPriceMin(value);
    }
  };

  const handlePriceMaxChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setPriceMax(value);
    }
  };

  const handleSizeMinChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setSizeMin(value);
    }
  };

  const handleSizeMaxChange = (e) => {
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

  const toggleSelection = (value, state, setState, paramName) => {
    let newState;
    if (state.includes(value)) {
      newState = state.filter((item) => item !== value);
    } else {
      newState = [...state, value];
    }
    setState(newState);

    const updatedValues = {};
    updatedValues[paramName] = newState;
    applyFilters(updatedValues);
  };

  const handleDateChange = (value) => {
    setListingDate(value);
    applyFilters({ listingDate: value });
  };

  return (
    <FilterContainer>
      <TopOptions>
        <ListingTypeToggle>
          <ToggleButton
            active={listingType === "buy"}
            onClick={() => handleListingTypeChange("buy")}
          >
            Buy
          </ToggleButton>
          <ToggleButton
            active={listingType === "rent"}
            onClick={() => handleListingTypeChange("rent")}
          >
            Rent
          </ToggleButton>
        </ListingTypeToggle>

        <SortSelect value={sortOption} onChange={handleSortChange}>
          <option value="newest">Most recent</option>
          <option value="price_asc">Lowest price</option>
          <option value="price_desc">Highest price</option>
        </SortSelect>
      </TopOptions>

      <FilterSection>
        <FilterTitle>Property Type</FilterTitle>
        <SelectInput value={propertyType} onChange={handlePropertyTypeChange}>
          <option value="">Select...</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="office">Office</option>
          <option value="land">Land</option>
        </SelectInput>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Price Range</FilterTitle>
        <RangeInputs>
          <TextInput
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={handlePriceMinChange}
            onBlur={handlePriceMinBlur}
          />
          <TextInput
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={handlePriceMaxChange}
            onBlur={handlePriceMaxBlur}
          />
        </RangeInputs>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Size (m²)</FilterTitle>
        <RangeInputs>
          <TextInput
            type="number"
            placeholder="Min"
            value={sizeMin}
            onChange={handleSizeMinChange}
            onBlur={handleSizeMinBlur}
          />
          <TextInput
            type="number"
            placeholder="Max"
            value={sizeMax}
            onChange={handleSizeMaxChange}
            onBlur={handleSizeMaxBlur}
          />
        </RangeInputs>
        <SizeDisplay>
          {sizeMin || "0"} - {sizeMax || "Any"} m²
        </SizeDisplay>
      </FilterSection>
      <FilterSection>
        <FilterTitle>Amenities</FilterTitle>
        <CheckboxGroup>
          {[
            { value: "ac", label: "Air conditioning" },
            { value: "heating", label: "Heating" },
            { value: "lift", label: "Lift" },
            { value: "parking", label: "Parking and storage" },
            { value: "terrace", label: "Terrace" },
            { value: "garden", label: "Garden" },
            { value: "pool", label: "Swimming pool" },
            { value: "accessible", label: "Accessible property" },
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
        <FilterTitle>Condition</FilterTitle>
        <CheckboxGroup>
          {[
            { value: "new", label: "New building" },
            { value: "good", label: "Good condition" },
            { value: "needs_renovation", label: "Needs renovating" },
            { value: "renovated", label: "Fully renovated" },
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
        <FilterTitle>Bedrooms</FilterTitle>
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
        <FilterTitle>Bathrooms</FilterTitle>
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
        <FilterTitle>Floor</FilterTitle>
        <CheckboxGroup>
          {[
            { value: "ground", label: "Ground floor" },
            { value: "intermediate", label: "Intermediate floor" },
            { value: "top", label: "Top floor" },
            { value: "with_plan", label: "With floor plan" },
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
        <FilterTitle>Publication Date</FilterTitle>
        <RadioGroup>
          {[
            { value: "last_24h", label: "Last 24 hours" },
            { value: "last_week", label: "Last week" },
            { value: "last_month", label: "Last month" },
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

const ToggleButton = styled.button`
  flex: 1;
  padding: 12px 0;
  text-align: center;
  background: ${(props) => (props.active ? "#1a1a1a" : "transparent")};
  color: ${(props) => (props.active ? "#ffffff" : "#4b5563")};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.active ? "#1a1a1a" : "#e5e7eb")};
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
