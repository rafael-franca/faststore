import { fetchAPI } from '../fetch'
import type { IStoreSelectedFacet } from '../../../../__generated__/schema'
import type { Context, Options } from '../../index'
import type { SelectedFacet } from '../../utils/facets'
import type { FacetSearchResult } from './types/FacetSearchResult'
import type {
  ProductSearchResult,
  Suggestion,
} from './types/ProductSearchResult'

export type Sort =
  | 'price:desc'
  | 'price:asc'
  | 'orders:desc'
  | 'name:desc'
  | 'name:asc'
  | 'release:desc'
  | 'discount:desc'
  | ''

export interface SearchArgs {
  query?: string
  page: number
  count: number
  type: 'product_search' | 'facets'
  sort?: Sort
  selectedFacets?: SelectedFacet[]
  fuzzy?: '0' | '1'
  hideUnavailableItems?: boolean
}

export interface ProductLocator {
  field: 'id' | 'slug'
  value: string
}

const POLICY_KEY = 'trade-policy'
const REGION_KEY = 'region-id'
const CHANNEL_KEYS = new Set([POLICY_KEY, REGION_KEY])

export const IntelligentSearch = (
  { account, environment, hideUnavailableItems }: Options,
  ctx: Context
) => {
  const base = `https://${account}.${environment}.com.br/api/io`

  const getPolicyFacet = (): IStoreSelectedFacet | null => {
    const { salesChannel } = ctx.storage.channel

    if (!salesChannel) {
      return null
    }

    return {
      key: POLICY_KEY,
      value: salesChannel,
    }
  }

  const getRegionFacet = (): IStoreSelectedFacet | null => {
    const { regionId } = ctx.storage.channel

    if (!regionId) {
      return null
    }

    return {
      key: REGION_KEY,
      value: regionId,
    }
  }

  const addDefaultFacets = (facets: SelectedFacet[]) => {
    const withDefaltFacets = facets.filter(({ key }) => !CHANNEL_KEYS.has(key))

    const policyFacet =
      facets.find(({ key }) => key === POLICY_KEY) ?? getPolicyFacet()

    const regionFacet =
      facets.find(({ key }) => key === REGION_KEY) ?? getRegionFacet()

    if (policyFacet !== null) {
      withDefaltFacets.push(policyFacet)
    }

    if (regionFacet !== null) {
      withDefaltFacets.push(regionFacet)
    }

    return withDefaltFacets
  }

  const search = <T>({
    query = '',
    page,
    count,
    sort = '',
    selectedFacets = [],
    type,
    fuzzy = '0',
  }: SearchArgs): Promise<T> => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      count: count.toString(),
      query,
      sort,
      fuzzy,
      locale: ctx.storage.locale,
    })

    if (hideUnavailableItems !== undefined) {
      params.append('hideUnavailableItems', hideUnavailableItems.toString())
    }

    const pathname = addDefaultFacets(selectedFacets)
      .map(({ key, value }) => `${key}/${value}`)
      .join('/')

    return fetchAPI(
      `${base}/_v/api/intelligent-search/${type}/${pathname}?${params.toString()}`
    )
  }

  const products = (args: Omit<SearchArgs, 'type'>) =>
    search<ProductSearchResult>({ ...args, type: 'product_search' })

  const suggestedTerms = (
    args: Omit<SearchArgs, 'type'>
  ): Promise<Suggestion> => {
    const params = new URLSearchParams({
      query: args.query?.toString() ?? '',
      locale: ctx.storage.locale,
    })

    return fetchAPI(
      `${base}/_v/api/intelligent-search/search_suggestions?${params.toString()}`
    )
  }

  const topSearches = (): Promise<Suggestion> => {
    const params = new URLSearchParams({
      locale: ctx.storage.locale,
    })

    return fetchAPI(
      `${base}/_v/api/intelligent-search/top_searches?${params.toString()}`
    )
  }

  const facets = (args: Omit<SearchArgs, 'type'>) =>
    search<FacetSearchResult>({ ...args, type: 'facets' })

  return {
    facets,
    products,
    suggestedTerms,
    topSearches,
  }
}
