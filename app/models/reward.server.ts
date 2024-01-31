

  export interface RewardDetail {
    itemNo: number
    rewardId: string
    productName : string
    productImage : string
    productDetail : string
    priceThb: number
    pricePoint: number
    remaining: number
    shareStatus: boolean
  }


  export interface RewardMetadata {
    currentPage: number
    perPage: number
    totalPage: number
    totalRow: number
  }
