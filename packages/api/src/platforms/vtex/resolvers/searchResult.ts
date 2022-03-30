import type { Resolver } from '..'
import type { SearchArgs } from '../clients/search'
import type { Attribute } from '../clients/search/types/AttributeSearchResult'
import type { ProductSearchResult } from '../clients/search/types/ProductSearchResult'
import { enhanceSku } from '../utils/enhanceSku'

type Root = Omit<SearchArgs, 'type'>

const REMOVED_FACETS_FROM_COLLECTION_PAGE = ['departamento']

function parseProducts(products: ProductSearchResult) {
  const skus = products.products
    .map((product) => {
      const [maybeSku] = product.skus

      return maybeSku && enhanceSku(maybeSku, product)
    })
    .filter((sku) => !!sku)

  return {
    pageInfo: {
      hasNextPage: products.pagination.after.length > 0,
      hasPreviousPage: products.pagination.before.length > 0,
      startCursor: '0',
      endCursor: products.total.toString(),
      totalCount: products.total,
    },
    edges: skus.map((sku, index) => ({
      node: sku,
      cursor: index.toString(),
    })),
  }
}

function parseSuggestedProducts(products: ProductSearchResult) {
  const skus = products.products
    .map((product) => {
      const [maybeSku] = product.skus

      return maybeSku && enhanceSku(maybeSku, product)
    })
    .filter((sku) => !!sku)

  return {
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: '0',
      endCursor: '5',
      totalCount: 5,
    },
    edges: skus.map((sku, index) => ({
      node: sku,
      cursor: index.toString(),
    })),
  }
}

export const StoreSearchResult: Record<string, Resolver<Root>> = {
  suggestions: async (searchArgs, _, ctx) => {
    const {
      clients: { search },
    } = ctx

    const suggestions = await search.suggestedTerms(searchArgs)

    const {
      suggestion: { searches },
    } = suggestions

    return searches
  },
  products: async (searchArgs, _, ctx) => {
    const {
      clients: { search },
    } = ctx

    if (searchArgs.suggestions) {
      const products = await search.suggestedProducts(searchArgs)

      return parseSuggestedProducts(products)
    }

    const products = await search.products(searchArgs)

    return parseProducts(products)
  },
  facets: async (searchArgs, _, ctx) => {
    const {
      clients: { search: is },
    } = ctx

    const facets = await is.facets(searchArgs)

    const isCollectionPage = !searchArgs.query
    const filteredFacets = facets?.attributes?.reduce((acc, currentFacet) => {
      const shouldFilterFacet = REMOVED_FACETS_FROM_COLLECTION_PAGE.includes(
        currentFacet.key
      )

      const shouldRemoveFacetFromCollectionPage =
        isCollectionPage && shouldFilterFacet

      if (shouldRemoveFacetFromCollectionPage) {
        return acc
      }

      currentFacet.values.sort((a, b) => {
        const firstItemLabel = a.label ?? ''
        const secondItemLabel = b.label ?? ''

        return firstItemLabel.localeCompare(secondItemLabel)
      })

      acc.push(currentFacet)

      return acc
    }, [] as Attribute[])

    return filteredFacets ?? []
  },
}
