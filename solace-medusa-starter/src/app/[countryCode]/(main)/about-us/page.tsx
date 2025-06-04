import { Metadata } from 'next'

import { getAboutUs, getExploreBlogData } from '@lib/data/fetch'
import { Banner } from '@modules/content/components/banner'
import { BasicContentSection } from '@modules/content/components/basic-content-section'
import { FramedTextSection } from '@modules/content/components/framed-text-section'
import { NumericalSection } from '@modules/content/components/numerical-section'
import { ExploreBlog } from '@modules/home/components/explore-blog'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'At Solace, we deliver innovative products designed to meet your needs with quality and care.',
}

const DefaultAboutContent = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <h1 className="text-4xl font-bold mb-6">About Solace</h1>
    <p className="text-lg max-w-2xl mb-10">
      At Solace, we deliver innovative products designed to meet your needs with quality and care. 
      Our commitment to sustainability and excellence drives everything we do.
    </p>
  </div>
);

export default async function AboutUsPage() {
  // Fetch data with error handling
  let aboutData = null;
  let blogPosts = [];

  try {
    const aboutResponse = await getAboutUs();
    aboutData = aboutResponse?.data;
  } catch (error) {
    console.error("Failed to fetch about us data:", error);
  }

  try {
    const blogResponse = await getExploreBlogData();
    blogPosts = blogResponse?.data || [];
  } catch (error) {
    console.error("Failed to fetch blog data:", error);
  }

  // If no data is available, show default content
  if (!aboutData) {
    return <DefaultAboutContent />;
  }

  const { Banner: bannerData, OurStory, WhyUs, OurCraftsmanship, Numbers } = aboutData || {};

  return (
    <>
      {bannerData && <Banner data={bannerData} />}
      {OurStory && <BasicContentSection data={OurStory} />}
      {WhyUs && <FramedTextSection data={WhyUs} />}
      {OurCraftsmanship && <BasicContentSection data={OurCraftsmanship} />}
      {Numbers && <NumericalSection data={Numbers} />}
      {blogPosts?.length > 0 && <ExploreBlog posts={blogPosts} />}
    </>
  )
}
