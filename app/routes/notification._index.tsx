import { MetaFunction , json } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";

import Layout from "~/components/Layout";
import NotificationTable from "~/components/NotificationTable";
import TabsComponent from "~/components/Tabs";
import { NotificationDetail } from "~/models/notification.server";

export const meta: MetaFunction = () => [{ title: "My Beer | Trade" }];

let mockupNotifications = {
  data : [
    {
      itemNo: 1 ,
      notificationId: "T123456789EX" ,
      notificationAt: "01/05/2023" ,
      imgUrl: "https://picsum.photos/200/300" , 
      name: "PeterPK" , 
      totalPoint: 3900 ,
      status: "pending" 
    },
    {
      itemNo: 2 ,
      notificationId: "T123456789EX" ,
      notificationAt: "01/05/2023" ,
      imgUrl: "https://picsum.photos/200/300" , 
      name: "PeterPB" , 
      totalPoint: 3900 ,
      status: "pending" 
    },
    {
      itemNo: 3 ,
      notificationId: "T123456789EX" ,
      notificationAt: "01/05/2023" ,
      imgUrl: "https://picsum.photos/200/300" , 
      name: "PeterPA" , 
      totalPoint: 3900 ,
      status: "pending" 
    },
  ]
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // เพิ่ม api ส่วนนี้แทนตัวแปร NotificationInfo
  let NotificationInfo = { ...mockupNotifications };
  return json({ NotificationInfo });
};

interface tabConfig {
  label : string 
  content? : React.ReactNode;
}



export default function Redeem (): JSX.Element {

  const { NotificationInfo } = useLoaderData() as { NotificationInfo : any };
  const [notificationData, setNotificationData] = useState<NotificationDetail[]>([]);
  const location = useLocation();


  useMemo(() => {
    if (NotificationInfo && NotificationInfo.data) {
      const notificationDataToSet: NotificationDetail[] = NotificationInfo.data || [];
      setNotificationData(notificationDataToSet);
    } else {
      setNotificationData([]);
    }
  }, [NotificationInfo]);

  console.log('notificationData' , notificationData)


  const tabConfig : tabConfig[] = [
    {
      label : 'Trading',
      content : <NotificationTable 
            data={notificationData}
          />
    },
    {
      label : 'Example'
    },
  ]

  return (
    <Layout title="Notification" isSubRoute={false} returnRoute="" pathname={location.pathname}>
      <TabsComponent tabs={tabConfig} />
    </Layout>
  )
}
