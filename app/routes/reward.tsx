import { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

import Layout from "~/components/Layout";
import RewardTable from "~/components/RewardTable";

export const meta: MetaFunction = () => [{ title: "My Beer | Product Reward" }];

export default function Reward (): JSX.Element {
  const location = useLocation();


  let mockupReward = {
    data : [
      {
        itemNo: 1,
        rewardId: "TH1",
        productName : "Product A",
        productImage : "https://picsum.photos/200/300",
        productDetail : "My Beer",
        priceThb: 100, 
        pricePoint: 10,
        remaining: 75, 
        shareStatus: true, 
      },
      {
        itemNo: 2,
        rewardId: "TH1",
        productName : "Product A",
        productImage : "https://picsum.photos/200/300",
        productDetail : "My Beer",
        priceThb: 100, 
        pricePoint: 10,
        remaining: 75, 
        shareStatus: true, 
      },
      {
        itemNo: 3,
        rewardId: "TH1",
        productName : "Product A",
        productImage : "https://picsum.photos/200/300",
        productDetail : "My Beer",
        priceThb: 100, 
        pricePoint: 10,
        remaining: 75, 
        shareStatus: false, 
      },
    ],
    currentPage: 1, 
    perPage: 10, 
    totalPage: 5, 
    totalRow: 5
  
  };

  return (
    <Layout title="Reward" pathname={location.pathname}>
      <RewardTable data={mockupReward} ></RewardTable>
    </Layout>
  )
}
