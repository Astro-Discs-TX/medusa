import { listCategories } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import { getCollectionsData } from '@lib/data/fetch'
import { getProductsList } from '@lib/data/products'
import { Container } from '@modules/common/components/container'

import NavActions from './nav-actions'
import NavContent from './nav-content'

export default async function NavWrapper(props: any) {
  try {
    // Handle each data fetch separately to prevent one failure from affecting others
    const productCategoriesPromise = listCategories().catch(() => []);
    const collectionsPromise = getCollectionsList().catch(() => ({ collections: [] }));
    const strapiCollectionsPromise = getCollectionsData().catch(() => ({ data: [] }));
    const productsPromise = getProductsList({
      pageParam: 0,
      queryParams: { limit: 4 },
      countryCode: props.countryCode,
    }).then(({ response }) => response).catch(() => ({ products: [], count: 0 }));

    // Await all promises
    const [productCategories, collectionsData, strapiCollections, products] = 
      await Promise.all([
        productCategoriesPromise,
        collectionsPromise,
        strapiCollectionsPromise,
        productsPromise,
      ]);

    return (
      <Container
        as="nav"
        className="duration-400 sticky top-0 z-50 mx-0 max-w-full border-b border-basic-primary bg-primary !py-0 transition-all ease-in-out medium:!px-14"
      >
        <Container className="flex items-center justify-between !p-0">
          <NavContent
            productCategories={productCategories}
            collections={collectionsData.collections || []}
            strapiCollections={strapiCollections}
            countryCode={props.countryCode}
            products={products.products || []}
          />
          <NavActions />
        </Container>
      </Container>
    )
  } catch (error) {
    console.error('Error rendering navigation:', error);
    
    // Fallback minimal navigation
    return (
      <Container
        as="nav"
        className="duration-400 sticky top-0 z-50 mx-0 max-w-full border-b border-basic-primary bg-primary !py-0 transition-all ease-in-out medium:!px-14"
      >
        <Container className="flex items-center justify-between !p-0">
          <NavActions />
        </Container>
      </Container>
    )
  }
}
