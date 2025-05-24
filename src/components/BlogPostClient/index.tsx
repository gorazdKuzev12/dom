"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { FiCalendar, FiUser, FiClock, FiEye, FiTag, FiArrowLeft, FiShare2, FiTwitter, FiFacebook, FiLinkedin } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Menu from "@/components/Menu/page";
import Footer from "@/components/Footer/page";

interface BlogPost {
  id: string;
  title_en: string;
  title_mk: string;
  title_sq: string;
  content_en: string;
  content_mk: string;
  content_sq: string;
  excerpt_en?: string;
  excerpt_mk?: string;
  excerpt_sq?: string;
  metaTitle_en?: string;
  metaTitle_mk?: string;
  metaTitle_sq?: string;
  metaDescription_en?: string;
  metaDescription_mk?: string;
  metaDescription_sq?: string;
  slug_en: string;
  slug_mk: string;
  slug_sq: string;
  featuredImage?: string;
  tags: string[];
  categories: string[];
  author: string;
  authorEmail?: string;
  publishedAt?: string;
  viewCount: number;
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogPostClientProps {
  blogPost: BlogPost | null;
  locale: string;
  error?: string;
}

export default function BlogPostClient({ blogPost, locale, error }: BlogPostClientProps) {
  const router = useRouter();

  // Get localized content
  const getLocalizedContent = (post: BlogPost, field: 'title' | 'content' | 'excerpt' | 'metaTitle' | 'metaDescription' | 'slug') => {
    return post[`${field}_${locale}` as keyof BlogPost] as string;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blogPost ? getLocalizedContent(blogPost, 'title') : '';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  const processContent = (content: string) => {
    // Split content by double newlines to create paragraphs
    const paragraphs = content.split(/\n\s*\n/);
    
    return paragraphs
      .map(paragraph => {
        const trimmed = paragraph.trim().replace(/\n/g, ' ');
        if (trimmed) {
          return `<p>${trimmed}</p>`;
        }
        return '';
      })
      .filter(p => p)
      .join('');
  };

  if (error || !blogPost) {
    return (
      <PageWrapper>
        <Menu />
        <ErrorContainer>
          <ErrorText>{error || "Blog post not found."}</ErrorText>
          <BackButton onClick={() => router.push(`/${locale}/blog`)}>
            <FiArrowLeft size={16} />
            Back to Blog
          </BackButton>
        </ErrorContainer>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <>
      <Head>
        <title>{getLocalizedContent(blogPost, 'metaTitle') || getLocalizedContent(blogPost, 'title')}</title>
        <meta 
          name="description" 
          content={getLocalizedContent(blogPost, 'metaDescription') || getLocalizedContent(blogPost, 'excerpt') || ''} 
        />
        <meta property="og:title" content={getLocalizedContent(blogPost, 'title')} />
        <meta 
          property="og:description" 
          content={getLocalizedContent(blogPost, 'excerpt') || ''} 
        />
        {blogPost.featuredImage && (
          <meta property="og:image" content={blogPost.featuredImage} />
        )}
        <meta property="og:type" content="article" />
        <meta property="article:author" content={blogPost.author} />
        <meta property="article:published_time" content={blogPost.publishedAt || blogPost.createdAt} />
        {blogPost.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Head>
      
      <PageWrapper>
        <Menu />
        <MainContent>
          <BackToButton onClick={() => router.push(`/${locale}/blog`)}>
            <FiArrowLeft size={16} />
            Back to Blog
          </BackToButton>

          <ArticleContainer>
            <ArticleHeader>
              <CategoryTags>
                {blogPost.categories.map((category) => (
                  <CategoryTag key={category}>{category}</CategoryTag>
                ))}
              </CategoryTags>

              <ArticleTitle>{getLocalizedContent(blogPost, 'title')}</ArticleTitle>
              
              {getLocalizedContent(blogPost, 'excerpt') && (
                <ArticleExcerpt>{getLocalizedContent(blogPost, 'excerpt')}</ArticleExcerpt>
              )}

              <ArticleMeta>
                <MetaGroup>
                  <MetaItem>
                    <FiUser size={16} />
                    <span>{blogPost.author}</span>
                  </MetaItem>
                  <MetaItem>
                    <FiCalendar size={16} />
                    <span>{formatDate(blogPost.publishedAt || blogPost.createdAt)}</span>
                  </MetaItem>
                  {blogPost.readingTime && (
                    <MetaItem>
                      <FiClock size={16} />
                      <span>{blogPost.readingTime} min read</span>
                    </MetaItem>
                  )}
                  <MetaItem>
                    <FiEye size={16} />
                    <span>{blogPost.viewCount} views</span>
                  </MetaItem>
                </MetaGroup>

                <ShareButtons>
                  <ShareButton onClick={() => handleShare('twitter')}>
                    <FiTwitter size={16} />
                  </ShareButton>
                  <ShareButton onClick={() => handleShare('facebook')}>
                    <FiFacebook size={16} />
                  </ShareButton>
                  <ShareButton onClick={() => handleShare('linkedin')}>
                    <FiLinkedin size={16} />
                  </ShareButton>
                  <ShareButton onClick={copyToClipboard}>
                    <FiShare2 size={16} />
                  </ShareButton>
                </ShareButtons>
              </ArticleMeta>
            </ArticleHeader>

            {blogPost.featuredImage && (
              <FeaturedImage>
                <img src={blogPost.featuredImage} alt={getLocalizedContent(blogPost, 'title')} />
              </FeaturedImage>
            )}

            <ArticleContent>
              <ContentText
                dangerouslySetInnerHTML={{
                  __html: processContent(getLocalizedContent(blogPost, 'content'))
                }}
              />
            </ArticleContent>

            <ArticleFooter>
              <TagsSection>
                <TagsLabel>Tags:</TagsLabel>
                <TagsList>
                  {blogPost.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsList>
              </TagsSection>

              <ShareSection>
                <ShareLabel>Share this article:</ShareLabel>
                <ShareButtons>
                  <ShareButton onClick={() => handleShare('twitter')}>
                    <FiTwitter size={18} />
                    Twitter
                  </ShareButton>
                  <ShareButton onClick={() => handleShare('facebook')}>
                    <FiFacebook size={18} />
                    Facebook
                  </ShareButton>
                  <ShareButton onClick={() => handleShare('linkedin')}>
                    <FiLinkedin size={18} />
                    LinkedIn
                  </ShareButton>
                  <ShareButton onClick={copyToClipboard}>
                    <FiShare2 size={18} />
                    Copy Link
                  </ShareButton>
                </ShareButtons>
              </ShareSection>
            </ArticleFooter>
          </ArticleContainer>
        </MainContent>
        <Footer />
      </PageWrapper>
    </>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const ErrorText = styled.div`
  font-size: 1.1rem;
  color: #dc2626;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #0c4240;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #143823;
    transform: translateY(-1px);
  }
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const BackToButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #0c4240;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;

  &:hover {
    background: #f5f9f9;
    border-color: #0c4240;
  }
`;

const ArticleContainer = styled.article`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const ArticleHeader = styled.header`
  padding: 2rem 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 0.75rem;
  }
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const CategoryTag = styled.span`
  background: #0c4240;
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ArticleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const ArticleExcerpt = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
`;

const MetaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #666;
  font-size: 0.85rem;

  svg {
    color: #0c4240;
    width: 14px;
    height: 14px;
  }
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.6rem;
  background: #f5f9f9;
  color: #0c4240;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;

  &:hover {
    background: #0c4240;
    color: white;
    transform: translateY(-1px);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const FeaturedImage = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ArticleContent = styled.div`
  padding: 1.5rem 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentText = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;

  p {
    margin-bottom: 1rem;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #0c4240;
    margin: 1.5rem 0 0.75rem;
    font-weight: 600;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  blockquote {
    border-left: 3px solid #0c4240;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: #666;
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  a {
    color: #0c4240;
    text-decoration: underline;

    &:hover {
      color: #143823;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 1rem 0;
  }

  code {
    background: #f5f9f9;
    padding: 0.15rem 0.3rem;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
  }

  pre {
    background: #f5f9f9;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      background: none;
      padding: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9rem;

    th, td {
      border: 1px solid #e1e5e9;
      padding: 0.6rem;
      text-align: left;
    }

    th {
      background: #f5f9f9;
      font-weight: 600;
      color: #0c4240;
    }

    tr:nth-child(even) {
      background: #f9f9f9;
    }
  }
`;

const ArticleFooter = styled.footer`
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e1e5e9;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem 1.5rem;
  }
`;

const TagsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const TagsLabel = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  background: #f5f9f9;
  color: #0c4240;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ShareSection = styled.div``;

const ShareLabel = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
`; 