"use client";

import { useState } from "react";
import styled from "styled-components";
import { FiCalendar, FiUser, FiClock, FiEye, FiTag, FiSearch, FiArrowRight } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";

interface BlogPost {
  id: string;
  title_en: string;
  title_mk: string;
  title_sq: string;
  excerpt_en?: string;
  excerpt_mk?: string;
  excerpt_sq?: string;
  slug_en: string;
  slug_mk: string;
  slug_sq: string;
  featuredImage?: string;
  tags: string[];
  categories: string[];
  author: string;
  publishedAt?: string;
  viewCount: number;
  readingTime?: number;
  createdAt: string;
}

interface BlogClientProps {
  blogPosts: BlogPost[];
  error?: string;
}

export default function BlogClient({ blogPosts, error }: BlogClientProps) {
  const locale = useLocale() as "en" | "mk" | "sq";
  const router = useRouter();
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Get localized content
  const getLocalizedContent = (post: BlogPost, field: 'title' | 'excerpt' | 'slug') => {
    return post[`${field}_${locale}` as keyof BlogPost] as string;
  };

  // Filter posts based on search term and filters
  const filteredPosts = blogPosts.filter((post: BlogPost) => {
    const matchesSearch = searchTerm === "" ||
      getLocalizedContent(post, 'title').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (getLocalizedContent(post, 'excerpt') || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || post.categories.includes(selectedCategory);
    const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Get all unique categories and tags
  const allCategories = [...new Set(blogPosts.flatMap((post: BlogPost) => post.categories))];
  const allTags = [...new Set(blogPosts.flatMap((post: BlogPost) => post.tags))];

  const handlePostClick = (post: BlogPost) => {
    const slug = getLocalizedContent(post, 'slug');
    router.push(`/${locale}/blog/${slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <PageWrapper>
        <Menu />
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Menu />
      <MainContent>
        <PageHeader>
          <HeaderContent>
            <PageTitle>Blog & Insights</PageTitle>
            <PageSubtitle>
              Discover the latest trends in real estate, investment tips, and market insights
            </PageSubtitle>
          </HeaderContent>
        </PageHeader>

        <ContentWrapper>
          <FiltersSection>
            <SearchBox>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>

            <FilterDropdowns>
              <FilterSelect
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </FilterSelect>
            </FilterDropdowns>
          </FiltersSection>

          <BlogGrid>
            {filteredPosts.map((post: BlogPost) => (
              <BlogCard key={post.id} onClick={() => handlePostClick(post)}>
                {post.featuredImage && (
                  <CardImage>
                    <img src={post.featuredImage} alt={getLocalizedContent(post, 'title')} />
                  </CardImage>
                )}
                
                <CardContent>
                  <CardHeader>
                    <CardTitle>{getLocalizedContent(post, 'title')}</CardTitle>
                    {getLocalizedContent(post, 'excerpt') && (
                      <CardExcerpt>{getLocalizedContent(post, 'excerpt')}</CardExcerpt>
                    )}
                  </CardHeader>

                  <CardMeta>
                    <MetaItem>
                      <FiUser size={14} />
                      <span>{post.author}</span>
                    </MetaItem>
                    <MetaItem>
                      <FiCalendar size={14} />
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </MetaItem>
                    {post.readingTime && (
                      <MetaItem>
                        <FiClock size={14} />
                        <span>{post.readingTime} min read</span>
                      </MetaItem>
                    )}
                    <MetaItem>
                      <FiEye size={14} />
                      <span>{post.viewCount} views</span>
                    </MetaItem>
                  </CardMeta>

                  {post.categories.length > 0 && (
                    <TagsContainer>
                      {post.categories.slice(0, 3).map((category) => (
                        <Tag key={category}>{category}</Tag>
                      ))}
                    </TagsContainer>
                  )}

                  <ReadMoreButton>
                    Read More
                    <FiArrowRight size={16} />
                  </ReadMoreButton>
                </CardContent>
              </BlogCard>
            ))}
          </BlogGrid>

          {filteredPosts.length === 0 && (
            <NoResults>
              <h3>No blog posts found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </NoResults>
          )}
        </ContentWrapper>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
`;

const ErrorContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.div`
  font-size: 1.1rem;
  color: #dc2626;
`;

const MainContent = styled.main`
  flex: 1;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #0c4240 0%, #143823 100%);
  color: white;
  padding: 4rem 2rem 3rem;
  text-align: center;
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: -1rem auto 0;
  padding: 0 1rem 2rem;
  position: relative;
`;

const FiltersSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0c4240;
    box-shadow: 0 0 0 3px rgba(12, 66, 64, 0.1);
  }
`;

const FilterDropdowns = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 2rem 0.6rem 0.75rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: #0c4240;
  }

  @media (max-width: 768px) {
    flex: 1;
    min-width: unset;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const BlogCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }

  ${BlogCard}:hover & img {
    transform: scale(1.03);
  }
`;

const CardContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.4rem;
  line-height: 1.4;
`;

const CardExcerpt = styled.p`
  color: #666;
  line-height: 1.5;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;

  svg {
    color: #0c4240;
    width: 12px;
    height: 12px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
`;

const Tag = styled.span`
  background: #f5f9f9;
  color: #0c4240;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const ReadMoreButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #0c4240;
  font-weight: 500;
  font-size: 0.85rem;
  margin-top: auto;
  padding-top: 0.75rem;
  transition: all 0.2s ease;

  svg {
    transition: all 0.2s ease;
    width: 14px;
    height: 14px;
  }

  ${BlogCard}:hover & {
    color: #143823;

    svg {
      transform: translateX(3px);
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    color: #333;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  p {
    color: #666;
    font-size: 0.9rem;
  }
`; 