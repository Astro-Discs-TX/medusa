import {
  AboutUsData,
  BlogData,
  BlogPost,
  CollectionsData,
  ContentPageData,
  FAQData,
  HeroBannerData,
  MidBannerData,
  VariantColorData,
} from 'types/strapi'

export const fetchStrapiClient = async (
  endpoint: string,
  params?: RequestInit
) => {
  try {
    // Check if Strapi URL is configured
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      console.warn('NEXT_PUBLIC_STRAPI_URL is not defined');
      return {
        ok: false,
        status: 404,
        json: async () => ({ data: null }),
      } as Response;
    }
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_READ_TOKEN || ''}`,
        },
        ...params,
      }
    );

    return response;
  } catch (error) {
    console.error(`Error fetching from Strapi: ${error}`);
    // Return a mock response object that can be used safely
    return {
      ok: false,
      status: 500,
      json: async () => ({ data: null }),
    } as Response;
  }
}

// Homepage data
export const getHeroBannerData = async (): Promise<HeroBannerData> => {
  const res = await fetchStrapiClient(
    `/api/homepage?populate[1]=HeroBanner&populate[2]=HeroBanner.CTA&populate[3]=HeroBanner.Image`,
    {
      next: { tags: ['hero-banner'] },
    }
  )

  return res.json()
}

export const getMidBannerData = async (): Promise<MidBannerData> => {
  const res = await fetchStrapiClient(
    `/api/homepage?populate[1]=MidBanner&populate[2]=MidBanner.CTA&populate[3]=MidBanner.Image`,
    {
      next: { tags: ['mid-banner'] },
    }
  )

  return res.json()
}

export const getCollectionsData = async (): Promise<CollectionsData> => {
  const res = await fetchStrapiClient(`/api/collections?&populate=*`, {
    next: { tags: ['collections-main'] },
  })

  return res.json()
}

export const getExploreBlogData = async (): Promise<BlogData> => {
  const res = await fetchStrapiClient(
    `/api/blogs?populate[1]=FeaturedImage&sort=createdAt:desc&pagination[start]=0&pagination[limit]=3`,
    {
      next: { tags: ['explore-blog'] },
    }
  )

  return res.json()
}

// Products
export const getProductVariantsColors = async (): Promise<VariantColorData> => {
  try {
    const res = await fetchStrapiClient(
      `/api/product-variants-colors?populate[1]=Type&populate[2]=Type.Image&pagination[start]=0&pagination[limit]=100`,
      {
        next: { tags: ['variants-colors'] },
      }
    );

    if (!res.ok) {
      console.warn('Failed to fetch product variant colors from Strapi');
      return { data: [] };
    }

    const data = await res.json();
    return data || { data: [] };
  } catch (error) {
    console.error('Error fetching product variant colors:', error);
    return { data: [] };
  }
}

// About Us
export const getAboutUs = async (): Promise<AboutUsData> => {
  const res = await fetchStrapiClient(
    `/api/about-us?populate[1]=Banner&populate[2]=OurStory.Image&populate[3]=OurCraftsmanship.Image&populate[4]=WhyUs.Tile.Image&populate[5]=Numbers`,
    {
      next: { tags: ['about-us'] },
    }
  )

  return res.json()
}

// FAQ
export const getFAQ = async (): Promise<FAQData> => {
  const res = await fetchStrapiClient(
    `/api/faq?populate[1]=FAQSection&populate[2]=FAQSection.Question`,
    {
      next: { tags: ['faq'] },
    }
  )

  return res.json()
}

// Content Page
export const getContentPage = async (
  type: string,
  tag: string
): Promise<ContentPageData> => {
  const res = await fetchStrapiClient(`/api/${type}?populate=*`, {
    next: { tags: [tag] },
  })

  return res.json()
}

// Blog
export const getBlogPosts = async ({
  sortBy = 'createdAt:desc',
  query,
  category,
}: {
  sortBy: string
  query?: string
  category?: string
}): Promise<BlogData> => {
  const baseUrl = `/api/blogs?populate[1]=FeaturedImage&populate[2]=Categories&sort=${sortBy}&pagination[limit]=1000`

  let urlWithFilters = baseUrl

  if (query) {
    urlWithFilters += `&filters[Title][$contains]=${query}`
  }

  if (category) {
    urlWithFilters += `&filters[Categories][Slug][$eq]=${category}`
  }

  const res = await fetchStrapiClient(urlWithFilters, {
    next: { tags: ['blog'] },
  })

  return res.json()
}

export const getBlogPostCategories = async (): Promise<BlogData> => {
  const res = await fetchStrapiClient(
    `/api/blog-post-categories?sort=createdAt:desc&pagination[limit]=100`,
    {
      next: { tags: ['blog-categories'] },
    }
  )

  return res.json()
}

// Blog
export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogPost | null> => {
  const res = await fetchStrapiClient(
    `/api/blogs?filters[Slug][$eq]=${slug}&populate=*`,
    {
      next: { tags: [`blog-${slug}`] },
    }
  )

  const data = await res.json()

  if (data.data && data.data.length > 0) {
    return data.data[0]
  }

  return null
}

export const getAllBlogSlugs = async (): Promise<string[]> => {
  const res = await fetchStrapiClient(`/api/blogs?populate=*`, {
    next: { tags: ['blog-slugs'] },
  })

  const data = await res.json()
  return data.data.map((post: BlogPost) => post.Slug)
}
