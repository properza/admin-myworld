import { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import { useState } from "react";
import GameSettingModal from "~/components/GameSettingModal";

import Layout from "~/components/Layout";

export const meta: MetaFunction = () => [{ title: "My Beer | Settings" }];

export default function Settings(): JSX.Element {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [setToggle, SetToggle] = useState(false);

  return (
    <Layout
      title="Settings"
      pathname={location.pathname}
      isSubRoute={false}
      returnRoute=""
    >
      <GameSettingModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="bg-white  p-[20px] rounded-[3px]">
        <div className="flex justify-between">
          <div className="flex">
            <p className="mr-4">Game active</p>
            <div className="flex rounded-[50px] bg-green-300 px-2 py-1 my-auto  ">
              <span className="rounded-full bg-green-500 w-[10px] h-[10px] my-auto mr-2"></span>
              <span className="text-[10px]">Online</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <img src="images/mdi_cog.svg" alt="" />
          </button>
        </div>
        <div className="text-grey-300">
          คุณสามารถตั้งค่าการเปิด / ปิดเกมส์ ได้ โดยกดที่ Setting icon
          จากนั้นระบุช่วงวันที่ต้องการปิดบริการ เมื่อปิดบริการ <br />
          ผู้เล่นทั้งหมดจะไม่สามารถเข้าเล่นเกมส์ได้
          และสามารถตั้งค่าเพื่อเปิดให้บริการอีกครั้ง
        </div>
      </div>
      <div className={!setToggle ? "flex justify-end" : "hidden"}>
        <button
          onClick={() => SetToggle(true)}
          className="bg-[#28B7E1] text-white flex p-2 rounded-[8px] border-[1px] w-auto mt-4  px-[20px]  my-auto"
        >
          <img src="images/tabler_edit.svg" alt="" />
          <div>Edit</div>
        </button>
      </div>
      <div className={setToggle ? "flex justify-end" : "hidden"}>
        <button className="bg-black text-white p-2 rounded-[8px] border-[1px] w-auto mt-4 mr-3 px-[40px]  my-auto">
          Set as Default
        </button>
        <button
          onClick={() => SetToggle(false)}
          
          className=" bg-white-500 text-black border-black border-[1px]  p-2 rounded-[8px] my-auto w-auto mt-4 mr-3 px-[40px] "
        >
          Discard
        </button>
        <button className="bg-[#28B7E1] text-white p-2 rounded-[8px] border-[1px] w-auto mt-4  px-[40px]  my-auto">
          Save
        </button>
      </div>

      <div className="mt-3">
        <div className="bg-white  p-[20px] rounded-[3px] mt-2">
          <div className="flex justify-between">
            <div>
              <p className="mr-4 font-bold">Score : Daily Log-in</p>
              <div className="text-grey-300">
                คะแนนที่ผู้เล่นจะได้ เมื่อ Log in เข้าเกมต่อวัน
              </div>
            </div>
            <div className="my-auto">
              <input
                type="text"
                className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
                value="10"
              />
              <span className="ml-3">Point</span>
            </div>
          </div>
        </div>
        <div className="bg-white  p-[20px] rounded-[3px] mt-2">
          <div className="flex justify-between">
            <div>
              <p className="mr-4 font-bold">
                Score : Share game to social media
              </p>
              <div className="text-grey-300">
                คะแนนที่ผู้เล่นจะได้ ต่อการแชร์เกมส์ผ่าน Social Media
              </div>
              <div className="font-bold mt-2">เงื่อนไขการแชร์</div>
            </div>
            <div className="my-auto">
              <div>
                <input
                  type="text"
                  className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
                  value="10"
                />
                <span className="ml-3">Point</span>
                <div className="flex justify-between mt-1">
                  <div className="mr-1">
                    <input
                      type="text"
                      className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3 w-[80px]"
                      value="10"
                    />
                    <span className="ml-3">ครั้งต่อ</span>
                  </div>
                  <select className="border-grey border-[1px] rounded-[5px] px-5">
                    <option value=""> เดือน</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white  p-[20px] rounded-[3px] mt-2">
          <div className="flex justify-between">
            <div>
              <p className="mr-4 font-bold">Up Level point</p>
              <div className="text-grey-300">
                คะแนนที่ผู้เล่นจะได้ต่อการ Up Level{" "}
              </div>
            </div>
            <div className="my-auto">
              <input
                type="text"
                className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
                value="10"
              />
              <span className="ml-3">Point</span>
            </div>
          </div>
        </div>
        <div className="bg-white  p-[20px] rounded-[3px] mt-2">
          <div className="flex justify-between">
            <div>
              <p className="mr-4 font-bold">Point (Depends on Star)</p>
              <div className="text-grey-300">
                คะแนนที่ผู้เล่นจะได้ ต่อดาวที่ผู้เล่นได้รับในแต่ละด่าน{" "}
              </div>
            </div>
            <div className="my-auto">
              <div className="mb-2">
                <input
                  type="text"
                  className=" rounded-[5px] py-2 text-end p-3 mr-3 bg-[#EEEEEE] border-[3px] "
                  value="3 ดาว"
                  disabled
                />
                <input
                  type="text"
                  className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
                  value="10"
                />
                <span className="ml-3">Point</span>
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className=" rounded-[5px] py-2 text-end p-3 mr-3 bg-[#EEEEEE] border-[3px] "
                  value="2 ดาว"
                  disabled
                />
                <input
                  type="text"
                  className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
                  value="10"
                />
                <span className="ml-3">Point</span>
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className=" rounded-[5px] py-2 text-end p-3 mr-3 bg-[#EEEEEE] border-[3px] "
                  value="1 ดาว"
                  disabled
                />
                <input
                  type="text"
                  className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
                  value="10"
                />
                <span className="ml-3">Point</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
