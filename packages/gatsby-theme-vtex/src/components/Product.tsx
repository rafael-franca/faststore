/** @jsx jsx */
import loadable from '@loadable/component'
import { Product } from '@vtex/gatsby-source-vtex'
import { FC, Fragment, useEffect } from 'react'
import { Button, Card, Grid, Heading, jsx } from 'theme-ui'

import { OfferLoading } from './Offer'
import ProductImage from './ProductImage'
import { DynamicProduct, StaticProduct } from './Shapes'
import { useCurrency } from './providers/Binding'
import SEO from './Seo'

// Price won't show up untill the requests is fulliled, so
// let's load it afterwards to not harm critical performance
const Offer = loadable(() => import('./Offer'), {
  ssr: false,
})

// Code-splits structured data injection
// because it's not critical for rendering the page.
const structuredData = loadable.lib(() => import('./structuredData'))

interface Props {
  staticProduct: StaticProduct
  dynamicProduct: DynamicProduct
}

const injectStructuredDataLazily = async (
  product: Product,
  currency: string
) => {
  const {
    default: { injectProduct },
  } = (await structuredData.load()) as any
  injectProduct(product, currency)
}

const ProductTemplate: FC<Props> = ({ dynamicProduct, staticProduct }) => {
  const [currency] = useCurrency()
  const { productName } = staticProduct

  // Inject StructuredData after rendering so we don't block the
  // rendering process and harm performance
  useEffect(() => {
    if (dynamicProduct) {
      injectStructuredDataLazily(dynamicProduct, currency)
    }
  }, [currency, dynamicProduct])

  return (
    <Fragment>
      <SEO title={productName} />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <ProductImage
          width={500}
          height={500}
          product={staticProduct}
          lazyLoad={false} // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <Offer product={dynamicProduct} fallback={<OfferLoading />} />
          <Button variant="productBuy" sx={{ width: '100%' }}>
            ADD TO CART
          </Button>
        </Card>
      </Grid>
    </Fragment>
  )
}

export default ProductTemplate
