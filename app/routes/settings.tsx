import { MetaFunction } from "@remix-run/node";
import { useLoaderData,useLocation } from "@remix-run/react";
import { useEffect,useState } from "react";
import GameSettingModal from "~/components/GameSettingModal";
import axios from "axios";
import Layout from "~/components/Layout";
import { getUserData,requireUserId } from "~/services/session.server";
import { ActionFunctionArgs,LoaderFunctionArgs } from "react-router";
import { getUsers } from "~/models/user.server";
// Meta function for setting page title
export const meta: MetaFunction = () => [{ title: "My Beer | Settings" }];

// Loader function to fetch the accessToken
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  return { accessToken };
};

export default function Settings(): JSX.Element {
  const { accessToken } = useLoaderData<typeof loader>();
  const location = useLocation();
  const [isOpen,setIsOpen] = useState(false);
  const [setToggle,SetToggle] = useState(false);
  const [isDisabled,setIsDisabled] = useState(true);
  const [dailyLoginPoints,setDailyLoginPoints] = useState(0);
  const [shareGamePoints,setShareGamePoints] = useState(0);
  const [shareGameTime,setShareGameTime] = useState(0);
  const [shareGamePer,setShareGamePer] = useState("");
  const [upLevelPoints,setUpLevelPoints] = useState(0);
  const [threeStarPoints,setThreeStarPoints] = useState(0);
  const [twoStarPoints,setTwoStarPoints] = useState(0);
  const [oneStarPoints,setOneStarPoints] = useState(0);
  const [gameStatus,setGameStatus] = useState("");
  const [openedDate,setOpenedDate] = useState("");
  const [closedDate,setClosedDate] = useState("");


  const today = new Date().toISOString().split('T')[0]
  const baseUrl = "https://games.myworld-store.com/api"; // Ensure this is set in your environment variables

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/games/gameSetting`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      console.log(data);
      setDailyLoginPoints(data.daily_login_point);
      setShareGamePoints(data.share_social_point);
      setShareGameTime(data.share_social_policy.times);
      setShareGamePer(data.share_social_policy.per);
      setUpLevelPoints(data.level_up_point);
      setThreeStarPoints(data.stage_point.three);
      setTwoStarPoints(data.stage_point.two);
      setOneStarPoints(data.stage_point.one);
      setOneStarPoints(data.stage_point.one);
      setGameStatus(data.game_status);
      setOpenedDate(data.opened_date);
      setClosedDate(data.closed_date);
    } catch (error) {
      console.error("Error fetching data:",error);
    }
  };

  const setDefault = async () => {
    try {
      const response = await axios.get(`${baseUrl}/games/gameSetting`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setDailyLoginPoints(data.daily_login_point);
      setShareGamePoints(data.share_social_point);
      setShareGameTime(data.share_social_policy.times);
      setShareGamePer(data.share_social_policy.per);
      setUpLevelPoints(data.level_up_point);
      setThreeStarPoints(data.stage_point.three);
      setTwoStarPoints(data.stage_point.two);
      setOneStarPoints(data.stage_point.one);
      setOneStarPoints(data.stage_point.one);
      setGameStatus(data.game_status);
      setOpenedDate(data.opened_date);
      setClosedDate(data.closed_date);
    } catch (error) {
      console.error("Error fetching data:",error);
    }
  };

  const updateStatus = async () => {
    const data = {
      daily_login_point: dailyLoginPoints,
      share_social_point: shareGamePoints,
      share_social_policy: {
        times: shareGameTime,
        per: shareGamePer, // ["day", "week", "month"]
      },
      level_up_point: upLevelPoints,
      stage_point: {
        one: oneStarPoints,
        two: twoStarPoints,
        three: threeStarPoints,
      },
    };

    try {
      const response = await axios.put(`${baseUrl}/games/gameSetting`,data,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsDisabled(true);
      SetToggle(false)

      console.log("Update successful:",response.data);
    } catch (error) {
      console.error("Failed to update status:",error);
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString !== "") {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2,"0");
      const day = String(date.getDate()).padStart(2,"0");
      return `${year}-${month}-${day}`;
    } else {
      return ""
    }
  };



  const updateGameStatus = async () => {
    const data = {
      game_status: gameStatus,
      opened_date: openedDate !== '' ? formatDate(openedDate) : today,
      closed_date: closedDate !== '' ? formatDate(closedDate) : today,
    };
    try {
      const response = await axios.put(`${baseUrl}/games/gameStatus`,data,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsOpen(false);
      console.log("Update successful:",response.data);
    } catch (error) {
      console.error("Failed to update status:",error);
    }
  };


  const setUndisabled = () => {
    SetToggle(true)
    setIsDisabled(!isDisabled);
  }


  const setDisabled = () => {
    SetToggle(false)
    setIsDisabled(true);
  }

  useEffect(() => {
    getData();
  },[accessToken]);

  return (
    <Layout
      title="Settings"
      pathname={location.pathname}
      isSubRoute={false}
      returnRoute=""
    >
      <GameSettingModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setGameStatus={setGameStatus}
        setOpenedDate={setOpenedDate}
        setClosedDate={setClosedDate}
        updateGameStatus={updateGameStatus}
        gameStatus={gameStatus}
        openedDate={openedDate}
        closedDate={closedDate}
      />
      <div className="bg-white  p-[20px] rounded-[3px]">
        <div className="flex justify-between">
          <div className="flex">
            <p className="mr-4">
              Game {gameStatus === "available" ? "active" : "unactive"}
            </p>
            <div
              className={`flex rounded-[50px] ${gameStatus === "available" ? "bg-green-300 " : "bg-red-300"
                } px-2 py-1 my-auto`}
            >
              <span
                className={`rounded-full  ${gameStatus === "available" ? "bg-green-500" : "bg-red-500"
                  } w-[10px] h-[10px] my-auto mr-2`}
              ></span>
              <span className="text-[10px]">
                {gameStatus === "available" ? "Online" : "Offline"}
              </span>
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
          onClick={() => setUndisabled()}
          className="bg-[#28B7E1] text-white flex p-2 rounded-[8px] border-[1px] w-auto mt-4  px-[20px]  my-auto"
        >
          <img src="images/tabler_edit.svg" alt="" />
          <div>Edit</div>
        </button>
      </div>
      <div className={setToggle ? "flex justify-end" : "hidden"}>
        <button
          onClick={setDefault}
          className="bg-black text-white p-2 rounded-[8px] border-[1px] w-auto mt-4 mr-3 px-[40px]  my-auto"
        >
          Set as Default
        </button>
        <button
          onClick={() => setDisabled()}
          className=" bg-white-500 text-black border-black border-[1px]  p-2 rounded-[8px] my-auto w-auto mt-4 mr-3 px-[40px] "
        >
          Discard
        </button>
        <button
          onClick={updateStatus}
          className="bg-[#28B7E1] text-white p-2 rounded-[8px] border-[1px] w-auto mt-4  px-[40px]  my-auto"
        >
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
                onChange={(e) =>
                  setDailyLoginPoints(Number(e.target.value) || 0)}

                value={dailyLoginPoints}
                disabled={isDisabled}
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
                  onChange={(e) => setShareGamePoints(Number(e.target.value) || 0)}
                  value={shareGamePoints}
                  disabled={isDisabled}

                />
                <span className="ml-3">Point</span>
                <div className="flex justify-between mt-1">
                  <div className="mr-1">
                    <input
                      type="text"
                      className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3 w-[80px]"
                      onChange={(e) => setShareGameTime(Number(e.target.value) || 0)}
                      value={shareGameTime}
                      disabled={isDisabled}

                    />
                    <span className="ml-3">ครั้งต่อ</span>
                  </div>
                  <select
                    onChange={(e) => setShareGamePer(e.target.value)}
                    className="border-grey border-[1px] rounded-[5px] px-5"
                    value={shareGamePer}
                    disabled={isDisabled}

                  >
                    <option value="day">วัน</option>
                    <option value="week">สัปดาห์</option>
                    <option value="month">เดือน</option>
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
                onChange={(e) => setUpLevelPoints(Number(e.target.value) || 0)}
                value={upLevelPoints}
                disabled={isDisabled}

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
                  onChange={(e) => setThreeStarPoints(Number(e.target.value) || 0)}
                  value={threeStarPoints}
                  disabled={isDisabled}

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
                  onChange={(e) => setTwoStarPoints(Number(e.target.value) || 0)}
                  value={twoStarPoints}
                  disabled={isDisabled}

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
                  onChange={(e) => setOneStarPoints(Number(e.target.value) || 0)}
                  value={oneStarPoints}
                  disabled={isDisabled}

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
