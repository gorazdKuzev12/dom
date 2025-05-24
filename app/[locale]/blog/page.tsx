import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import BlogClient from "@/components/BlogClient";

const GET_BLOG_POSTS = gql`
  query GetBlogPosts($filter: BlogPostFilterInput) {
    blogPosts(filter: $filter) {
      id
      title_en
      title_mk
      title_sq
      excerpt_en
      excerpt_mk
      excerpt_sq
      slug_en
      slug_mk
      slug_sq
      featuredImage
      tags
      categories
      author
      publishedAt
      viewCount
      readingTime
      createdAt
    }
  }
`;

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

export default async function BlogPage() {
  const client = getClient();
  
  try {
    // Fetch published blog posts
    const { data } = await client.query({
      query: GET_BLOG_POSTS,
      variables: {
        filter: {
          isPublished: true,
        },
      },
    });

    const blogPosts: BlogPost[] = data?.blogPosts || [];

    // Pass data to client component
    return (
      <BlogClient 
        blogPosts={blogPosts}
      />
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Pass error to client component
    return (
      <BlogClient 
        blogPosts={[]}
        error="Error loading blog posts. Please try again later."
      />
    );
  }
} 