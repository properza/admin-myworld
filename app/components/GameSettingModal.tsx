import { useState } from "react";

interface GameSettingModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const GameSettingModal = ({ setIsOpen, isOpen }: GameSettingModalProps) => {
  const [inputValue, setInputValue] = useState(0);
  const [setToggle, SetToggle] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleUpdate = () => {

    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="w-[380px] mx-auto bg-white p-4 shadow-md z-10 rounded-[15px]">
        <div className="flex justify-between items-center mb-4 border-b-[2px] border-grey-300 pb-4">
          <h1 className="text-lg font-semibold text-[24px]">Game Setting</h1>
        </div>
        <div className="mb-4 border-b-[2px] border-grey-300 pb-4">
          <div>
            {" "}
            <input
              type="radio"
              onChange={() => SetToggle(false)}
              name="open"
              className="p-1 rounded-[20px] mr-2 accent-[#28B7E1]"
              id="openBox"
              checked={!setToggle}
            />
            <label htmlFor="openBox">เปิดให้บริการ</label>
          </div>
          <div>
            {" "}
            <input
              type="radio"
              onClick={() => SetToggle(true)}
              name="open"
              className="p-1 rounded-[20px] mr-2 accent-[#28B7E1] "
              id="closeBox"
              checked={setToggle}
            />
            <label htmlFor="closeBox">ปิดให้บริการ</label>
          </div>
        </div>
        <div className={setToggle ? "" : "hidden"}>
          <div className="flex justify-between mb-2 my-auto">
            <p className="my-auto">วันที่เริ่มปิด</p>
            <input
              type="date"
              className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
            />
          </div>
          <div className="flex justify-between ">
            <p className="my-auto">วันที่สิ้นสุด</p>
            <input
              type="date"
              className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3"
            />
          </div>
          <div className="flex justify-start">
            <input
              type="checkbox"
              className="border-grey border-[1px] rounded-[5px] py-2 text-end p-3 mr-1"
            />
            <p>ไม่ระบุวันสิ้นสุด</p>
          </div>
          <div className="my-4 py-3 ">
            <p className="my-auto  text-red-500">
              *เมื่อกด Confirm ผู้เล่นทั้งหมดจะไม่สามารถเข้าเล่นเกมส์ได้
              ตามช่วงเวลาที่ตั้งค่าไว้
            </p>
          </div>
        </div>

        <div className="flex">
          <button className="bg-transparent border-red-500 border-[1px] text-red-500 px-4 py-2 rounded-[10px] mr-2 w-full">
            Confirm
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-[10px] w-full"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSettingModal;
