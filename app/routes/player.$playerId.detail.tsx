import {
  MetaFunction,
  json,
  redirect,
  LoaderFunctionArgs,
} from "@remix-run/node";
import Layout from "~/components/Layout";
import StockPopup from "~/components/StockModal";
import invariant from "tiny-invariant";
import { useLocation } from "react-router";

export const meta: MetaFunction = () => [{ title: "My Beer | Player" }];

export default function Redeem(): JSX.Element {
  const location = useLocation();
  return (
    <Layout
      title="รายละเอียดผู้เล่น"
      isSubRoute={true}
      returnRoute="/player"
      pathname={location.pathname}
    >
      <div className="mt-3">
        <div className="bg-white  p-[20px] rounded-[10px] mb-6 py-5 shadow-lg ">
          <div className="flex ">
            <div className="mr-3">
              <img
                src="/images/avatar.svg"
                className="w-[100px] h-[100px]"
                alt=""
              />
            </div>
            <div>
              <div className="mb-3">
                <p className="mr-4 font-bold text-[20px]">Peter Parker</p>
              </div>
              <div className="flex text-grey-300 my-2">
                <div className="mr-3">All point : </div>
                <div className="flex">
                  <img
                    src="/images/point.svg"
                    className="w-[20px] h-[20px] mr-2"
                    alt=""
                  />
                  15000
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
      </div>
    </Layout>
  );
}
