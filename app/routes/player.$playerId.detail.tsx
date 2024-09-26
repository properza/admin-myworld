import { MetaFunction,json,redirect } from "@remix-run/node";
import Layout from "~/components/Layout";
import StockPopup from "~/components/StockModal";
import invariant from "tiny-invariant";
import { LoaderFunctionArgs,useLocation } from "react-router";
import { useEffect,useState } from "react";
import { getUserData,requireUserId } from "~/services/session.server";
import { useLoaderData } from "@remix-run/react";
import { playersDetail } from "~/models/players.server"; // Ensure this import is correct
import axios from "axios";

export const meta: MetaFunction = () => [{ title: "My Beer | Player" }];

export const loader = async ({ request,params }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const playerId = params.playerId;
  const { accessToken } = await getUserData(request);
  return { accessToken,playerId };
};

export default function PlayerDetailsPage(): JSX.Element {
  // const location = useLocation();
  const [data,setData] = useState<any>([]);
  const { accessToken,playerId } = useLoaderData<typeof loader>();

  const getData = async () => {
    const baseUrl = "https://games.myworld-store.com/api"; // Ensure this is set in your environment variables
    try {
      const response = await axios.get(
        `${baseUrl}/customers/administrator/${playerId}/gameInfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setData(response.data);
      // console.log(response);
    } catch (error) {
      console.error("Error fetching player details:",error);
    }
  };

  useEffect(() => {
    getData(); // Make sure accessToken and playerId are defined in your component
  },[]);

  return (
    <Layout
      title="รายละเอียดผู้เล่น"
      isSubRoute={true}
      returnRoute="/players"
      pathname={'/players'}
    >
      <div className="mt-3">
        <div className="bg-white  p-[20px] rounded-[10px] mb-6 py-5 shadow-lg ">
          <div className="flex ">
            <div className=" ">
              <img
                src={data.picture ? data.picture : "/images/avatar.svg"}
                className="w-[100px] h-[100px] rounded-full mr-3 overflow-hidden"
                alt=""
              />
            </div>
            <div>
              <div className="mb-3">
                <p className="mr-4 font-bold text-[20px]">{data.name}</p>
              </div>
              <div className="flex text-grey-300 my-2">
                <div className="mr-3">All point : </div>
                <div className="flex">
                  <img
                    src="/images/point.svg"
                    className="w-[20px] h-[20px] mr-2"
                    alt=""
                  />
                  {data.point}
                </div>
              </div>
              <div className="flex text-grey-300 my-2">
                <div className="mr-3">Game point : </div>
                <div className="flex">
                  <img
                    src="/images/ion_game-controller.svg"
                    className="w-[20px] h-[20px] mr-2"
                    alt=""
                  />
                  15000
                </div>
              </div>
            </div>
          </div>
        </div>

        {data.log > 0 && (
          <>
            <div className="bg-white  p-[20px] rounded-[10px] mb-2 py-2 shadow-md ">
              <div className="flex justify-between">
                <div className=" flex mr-3">
                  <img
                    src="/images/avatar.svg"
                    className="w-[20px] h-[20px] mr-3"
                    alt=""
                  />
                  <p className="mr-4 font-bold ">ผ่านด่าน 2</p>
                </div>
                <div className="text-blue-500">+50</div>
              </div>
              <div>
                <div className="flex text-grey-300 my-2">
                  <div className="mr-3">ดาว : </div>
                  <div className="flex">1</div>
                </div>
                <div className="flex text-grey-300 my-2">
                  <div className="mr-3">วันที : </div>
                  <div className="flex">13/01/2024 - 17:30</div>
                </div>
              </div>
            </div>
            <div className="bg-white  p-[20px] rounded-[10px] mb-2 py-2 shadow-md ">
              <div className="flex justify-between">
                <div className=" flex mr-3">
                  <img
                    src="/images/icon-park-solid_check-one.svg"
                    className="w-[20px] h-[20px] mr-3"
                    alt=""
                  />
                  <p className="mr-4 font-bold ">Daily Log-in</p>
                </div>
                <div className="text-blue-500">+50</div>
              </div>
              <div>
                <div className="flex text-grey-300 my-2">
                  <div className="mr-3">ดาว : </div>
                  <div className="flex">3</div>
                </div>
                <div className="flex text-grey-300 my-2">
                  <div className="mr-3">วันที : </div>
                  <div className="flex">13/01/2024 - 17:30</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
