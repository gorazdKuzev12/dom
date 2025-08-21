import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import BlogPostClient from "@/components/BlogPostClient";

const GET_BLOG_POST_BY_SLUG = gql`
  query GetBlogPostBySlug($slug: String!, $locale: String!) {
    blogPostBySlug(slug: $slug, locale: $locale) {
      id
      title_en
      title_mk
      title_sq
      content_en
      content_mk
      content_sq
      excerpt_en
      excerpt_mk
      excerpt_sq
      metaTitle_en
      metaTitle_mk
      metaTitle_sq
      metaDescription_en
      metaDescription_mk
      metaDescription_sq
      slug_en
      slug_mk
      slug_sq
      featuredImage
      tags
      categories
      author
      authorEmail
      publishedAt
      viewCount
      readingTime
      createdAt
      updatedAt
    }
  }
`;

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

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string; locale: string }> 
}) {
  const resolvedParams = await params;
  const client = getClient();
  const { slug, locale } = resolvedParams;
  
  try {
    // Fetch blog post by slug
    const { data } = await client.query({
      query: GET_BLOG_POST_BY_SLUG,
      variables: {
        slug,
        locale,
      },
    });

    const blogPost: BlogPost | null = data?.blogPostBySlug || null;

    // Pass data to client component
    return (
      <BlogPostClient 
        blogPost={blogPost}
        locale={locale}
      />
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    
    // Pass error to client component
    return (
      <BlogPostClient 
        blogPost={null}
        locale={locale}
        error="Blog post not found."
      />
    );
  }
} 