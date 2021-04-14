
/**
 * Warning: This is an autogenerated file.
 *
 * Changes in this file won't take effect and will be overwritten
 */

// Base Types
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type Maybe<T> = T | null | undefined
type Scalars = {
  Boolean: boolean
  String: string
  Float: number
  Int: number
  ID: string
}

// Operation related types
export type ProductRecommendationsQueryQueryVariables = Exact<{
  identifier: Vtex_ProductUniqueIdentifier;
  type: Vtex_CrossSelingInputEnum;
}>;


export type ProductRecommendationsQueryQuery = { vtex: { productRecommendations: Maybe<Array<Maybe<{ productName: Maybe<string>, linkText: Maybe<string>, id: Maybe<string>, productClusters: Maybe<Array<Maybe<{ id: Maybe<string>, name: Maybe<string> }>>>, items: Maybe<Array<Maybe<{ itemId: Maybe<string>, images: Maybe<Array<Maybe<{ imageUrl: Maybe<string>, imageText: Maybe<string> }>>>, sellers: Maybe<Array<Maybe<{ sellerId: Maybe<string>, commercialOffer: Maybe<{ spotPrice: Maybe<number>, availableQuantity: Maybe<number>, price: Maybe<number>, listPrice: Maybe<number>, maxInstallments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number> }>>>, installments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number>, interestRate: Maybe<number> }>>>, teasers: Maybe<Array<{ name: Maybe<string> }>> }> }>>> }>>> }>>> } };


// Query Related Code

export const ProductRecommendationsQuery = {
  query: process.env.NODE_ENV === 'production' ? undefined : "query ProductRecommendationsQuery($identifier: VTEX_ProductUniqueIdentifier!, $type: VTEX_CrossSelingInputEnum!) {\n  vtex {\n    productRecommendations(identifier: $identifier, type: $type) {\n      id: productId\n      productName\n      linkText\n      productClusters {\n        id\n        name\n      }\n      items {\n        itemId\n        images {\n          imageUrl\n          imageText\n        }\n        sellers {\n          sellerId\n          commercialOffer: commertialOffer {\n            maxInstallments: Installments(criteria: MAX_WITHOUT_INTEREST) {\n              value: Value\n              numberOfInstallments: NumberOfInstallments\n            }\n            installments: Installments(criteria: ALL) {\n              value: Value\n              numberOfInstallments: NumberOfInstallments\n              interestRate: InterestRate\n            }\n            availableQuantity: AvailableQuantity\n            price: Price\n            listPrice: ListPrice\n            spotPrice\n            teasers {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}\n",
  sha256Hash: "546c308f872a3bf8e1c8dba67579c914229d13b662d6364f349db98071296cc4",
  operationName: "ProductRecommendationsQuery",
}

