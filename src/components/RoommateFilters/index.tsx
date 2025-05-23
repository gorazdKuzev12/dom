"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { FiFilter, FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface City {
  id: string;
  name_en: string;
  name_mk: string;
  name_sq: string;
  slug: string;
}

interface RoommateFiltersProps {
  cities: City[];
}

export default function RoommateFilters({ cities }: RoommateFiltersProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Helper function to update search params
  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Helper function to toggle boolean params
  const toggleBooleanParam = (key: string) => {
    const currentValue = searchParams.get(key);
    const newValue = currentValue === 'true' ? null : 'true';
    updateSearchParams(key, newValue);
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname);
  };

  return (
    <>
      <MobileFilterButton onClick={() => setShowMobileFilters(!showMobileFilters)}>
        <FiFilter size={20} />
        Filters
      </MobileFilterButton>

      <Overlay show={showMobileFilters} onClick={() => setShowMobileFilters(false)} />
      
      <Sidebar show={showMobileFilters}>
        <MobileFilterHeader>
          <FilterTitle>Filters</FilterTitle>
          <CloseButton onClick={() => setShowMobileFilters(false)}>
            <FiX size={24} />
          </CloseButton>
        </MobileFilterHeader>

        {/* Location Filters */}
        <FilterSection>
          <FilterLabel>City</FilterLabel>
          <Select
            value={searchParams.get('cityId') || ''}
            onChange={(e) => updateSearchParams('cityId', e.target.value)}
          >
            <option value="">All cities</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name_en}
              </option>
            ))}
          </Select>
        </FilterSection>

        {/* Budget Filters */}
        <FilterSection>
          <FilterLabel>Budget Range (€)</FilterLabel>
          <BudgetRow>
            <BudgetInput
              type="number"
              placeholder="Min"
              value={searchParams.get('budgetMin') || ''}
              onChange={(e) => updateSearchParams('budgetMin', e.target.value)}
            />
            <BudgetSeparator>-</BudgetSeparator>
            <BudgetInput
              type="number"
              placeholder="Max"
              value={searchParams.get('budgetMax') || ''}
              onChange={(e) => updateSearchParams('budgetMax', e.target.value)}
            />
          </BudgetRow>
        </FilterSection>

        {/* Housing Type */}
        <FilterSection>
          <FilterLabel>Housing Type</FilterLabel>
          <Select
            value={searchParams.get('housingType') || ''}
            onChange={(e) => updateSearchParams('housingType', e.target.value)}
          >
            <option value="">Any</option>
            <option value="ROOM_IN_SHARED_APARTMENT">Room in shared apartment</option>
            <option value="ENTIRE_APARTMENT_SHARED">Entire apartment with roommate</option>
            <option value="STUDIO_SHARED">Shared studio</option>
            <option value="HOUSE_SHARED">Shared house</option>
          </Select>
        </FilterSection>

        {/* Age Range */}
        <FilterSection>
          <FilterLabel>Age Range</FilterLabel>
          <BudgetRow>
            <BudgetInput
              type="number"
              placeholder="Min"
              value={searchParams.get('ageMin') || ''}
              onChange={(e) => updateSearchParams('ageMin', e.target.value)}
            />
            <BudgetSeparator>-</BudgetSeparator>
            <BudgetInput
              type="number"
              placeholder="Max"
              value={searchParams.get('ageMax') || ''}
              onChange={(e) => updateSearchParams('ageMax', e.target.value)}
            />
          </BudgetRow>
        </FilterSection>

        {/* Gender */}
        <FilterSection>
          <FilterLabel>Gender</FilterLabel>
          <Select
            value={searchParams.get('gender') || ''}
            onChange={(e) => updateSearchParams('gender', e.target.value)}
          >
            <option value="">Any</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NON_BINARY">Non-binary</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </Select>
        </FilterSection>

        {/* Move-in Date */}
        <FilterSection>
          <FilterLabel>Move-in Date</FilterLabel>
          <Input
            type="date"
            value={searchParams.get('moveInDate') || ''}
            onChange={(e) => updateSearchParams('moveInDate', e.target.value)}
          />
        </FilterSection>

        {/* Lifestyle Preferences */}
        <FilterSection>
          <FilterLabel>Lifestyle Preferences</FilterLabel>
          
          <Select
            value={searchParams.get('smokingPolicy') || ''}
            onChange={(e) => updateSearchParams('smokingPolicy', e.target.value)}
          >
            <option value="">Smoking - Any</option>
            <option value="NON_SMOKER">Non-smoker</option>
            <option value="SMOKER_OK">Smoker OK</option>
            <option value="OUTDOOR_SMOKING_ONLY">Outdoor smoking only</option>
          </Select>

          <Select
            value={searchParams.get('petPolicy') || ''}
            onChange={(e) => updateSearchParams('petPolicy', e.target.value)}
          >
            <option value="">Pets - Any</option>
            <option value="NO_PETS">No pets</option>
            <option value="CATS_OK">Cats OK</option>
            <option value="DOGS_OK">Dogs OK</option>
            <option value="ALL_PETS_OK">All pets OK</option>
          </Select>

          <Select
            value={searchParams.get('cleanlinessLevel') || ''}
            onChange={(e) => updateSearchParams('cleanlinessLevel', e.target.value)}
          >
            <option value="">Cleanliness - Any</option>
            <option value="VERY_CLEAN">Very clean</option>
            <option value="CLEAN">Clean</option>
            <option value="AVERAGE">Average</option>
            <option value="RELAXED">Relaxed</option>
          </Select>

          <Select
            value={searchParams.get('noiseLevel') || ''}
            onChange={(e) => updateSearchParams('noiseLevel', e.target.value)}
          >
            <option value="">Noise Level - Any</option>
            <option value="VERY_QUIET">Very quiet</option>
            <option value="QUIET">Quiet</option>
            <option value="MODERATE">Moderate</option>
            <option value="LIVELY">Lively</option>
          </Select>
        </FilterSection>

        {/* Status Checkboxes */}
        <FilterSection>
          <FilterLabel>Status & Verification</FilterLabel>
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="isStudent"
                checked={searchParams.get('isStudent') === 'true'}
                onChange={() => toggleBooleanParam('isStudent')}
              />
              <CheckboxLabel htmlFor="isStudent">Student</CheckboxLabel>
            </CheckboxItem>
            
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="isProfessional"
                checked={searchParams.get('isProfessional') === 'true'}
                onChange={() => toggleBooleanParam('isProfessional')}
              />
              <CheckboxLabel htmlFor="isProfessional">Professional</CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="workFromHome"
                checked={searchParams.get('workFromHome') === 'true'}
                onChange={() => toggleBooleanParam('workFromHome')}
              />
              <CheckboxLabel htmlFor="workFromHome">Works from home</CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="isVerified"
                checked={searchParams.get('isVerified') === 'true'}
                onChange={() => toggleBooleanParam('isVerified')}
              />
              <CheckboxLabel htmlFor="isVerified">Verified profiles only</CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="isOnline"
                checked={searchParams.get('isOnline') === 'true'}
                onChange={() => toggleBooleanParam('isOnline')}
              />
              <CheckboxLabel htmlFor="isOnline">Online now</CheckboxLabel>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                id="isLocationFlexible"
                checked={searchParams.get('isLocationFlexible') === 'true'}
                onChange={() => toggleBooleanParam('isLocationFlexible')}
              />
              <CheckboxLabel htmlFor="isLocationFlexible">Flexible location</CheckboxLabel>
            </CheckboxItem>
          </CheckboxGroup>
        </FilterSection>

        {/* Clear Filters Button */}
        <ClearButton onClick={clearAllFilters}>
          Clear All Filters
        </ClearButton>
      </Sidebar>
    </>
  );
}

// Styled Components
const MobileFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f5f7;
  }
`;

const Sidebar = styled.div<{ show: boolean }>`
  width: 100%;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  height: fit-content;

  @media (max-width: 767px) {
    position: fixed;
    top: 7%;
    right: 0;
    bottom: 0;
    width: 85%;
    max-width: 400px;
    z-index: 100;
    border-radius: 0;
    overflow-y: auto;
    transform: translateX(${props => props.show ? "0" : "100%"});
    transition: transform 0.3s ease;
    box-shadow: ${props => props.show ? "-5px 0 15px rgba(0, 0, 0, 0.1)" : "none"};
  }

  @media (min-width: 768px) {
    width: 280px;
    position: sticky;
    top: 2rem;
  }
`;

const FilterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1a1a1a;
  letter-spacing: -0.2px;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1a1a1a;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #26825c;
    box-shadow: 0 0 0 3px rgba(38, 130, 92, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #1a1a1a;
  background-color: white;
  appearance: none;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #26825c;
    box-shadow: 0 0 0 3px rgba(38, 130, 92, 0.1);
  }
`;

const BudgetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BudgetInput = styled(Input)`
  margin-bottom: 0;
  flex: 1;
`;

const BudgetSeparator = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
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
  accent-color: #26825c;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const Overlay = styled.div<{ show: boolean }>`
  display: none;
  
  @media (max-width: 767px) {
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`; 