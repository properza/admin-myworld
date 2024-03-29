import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loader } from "~/routes/_index";
import { constructURL } from "~/utils";

interface StockModalProps {
  title: string | undefined;
  price: number | undefined;
  stock_id: number | undefined;
  totalstock: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  accessToken: string;
}

export default function StockModal({
  title,
  price,
  stock_id,
  totalstock,
  isOpen,
  setIsOpen,
  accessToken,
}: StockModalProps) {
  // update 2 filed outstock or instock

  const [stock, setStock] = useState<number>(0);
  const [instock, setInStock] = useState<number>(0);
  const [outstock, setOutStock] = useState<number>(0);
  const [inputValue, setInputValue] = useState(0);
  const [inClicked, setInClicked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle stock update
  const handleStockUpdate = (add: boolean) => {
    // setStock(add ? stock + inputValue : stock - inputValue);
    setInClicked(add);
    if (add) {
      setInputValue(instock);
    } else {
      setInputValue(outstock);
    }
  };

  const sliderStyle = {
    transform: inClicked ? "translate-x-[0]" : "translate-x-[110%]", // Move the slider to the left or right
  };

  const handleClose = () => {
    setIsOpen(false);
    setInStock(0);
    setOutStock(0);
  };

  const handleInStock = async () => {
    let value = inClicked ? instock.toString() : outstock.toString();
    let status = inClicked ? "in" : "out";

    try {
      setIsLoading(true);
      const response = await fetch(
        constructURL(
          "https://games.myworld-store.com/api-dev",
          `/products/${stock_id}/${status}`,
        ),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ value }),
        },
      );
      if (response.ok) {
        await handleClose();
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        navigate("/stock");
      } else {
        throw new Error("error has occured");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setStock(totalstock);
  }, [totalstock]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="max-w-sm mx-auto bg-white p-4 shadow-md z-10 rounded-[15px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Update Stock</h1>
          {/* <img
              src="/path-to-your-image.png"
              alt="Product"
              className="w-16 h-16"
            /> */}
        </div>
        <div className="mb-4 flex">
          <div className="mr-3 p-0">
            <img src="/images/product_mockup.svg" alt="" />
          </div>
          <div>
            <p>{title}</p>
            <p>Variants: {price}</p>
            <p className="text-lg font-bold">{price?.toFixed(2)}</p>{" "}
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between">
            <p>In stock</p>
            <p className="font-bold">{stock}</p>
          </div>
          <div className="flex justify-between">
            <p>Update</p>
            <p className="font-bold">
              {stock} →{" "}
              <span className="text-sky-500">
                {inClicked
                  ? instock > 0
                    ? stock + (instock || 0)
                    : 0
                  : outstock > 0
                  ? stock - outstock
                  : 0}
              </span>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <div className="relative px-1 bg-slate-100 rounded-lg w-full">
            <div className="flex">
              <div
                className={`absolute bg-sky-500 text-white h-10 sm:w-[150px] w-[135.3px] m-2 rounded-[5px] transform  ease duration-300 ${sliderStyle.transform}`}
              ></div>

              <button
                onClick={() => handleStockUpdate(true)}
                className={`z-10  px-4 py-2 rounded-[3px] sm:w-[150px] w-[150px] bg-transparent m-2  ${
                  inClicked != true ? "text-sky-500" : "text-white"
                }`}
              >
                + IN
              </button>

              <button
                onClick={() => handleStockUpdate(false)}
                className={`z-10 px-4 py-2 rounded-[3px] sm:w-[150px] w-[150px] bg-transparent m-2  ${
                  inClicked != false ? "text-sky-500" : "text-white "
                }`}
              >
                - OUT
              </button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-1 mt-3">
            {inClicked ? "+ Add Stock" : "- Reduce Stock"}
          </div>
          <input
            type="number"
            min="0"
            value={inClicked ? instock : outstock ?? 0}
            onChange={(e) => {
              let value = e.target.value;
              if (value.startsWith("0") || value.startsWith("-")) {
                return;
              }
              let numValue = Number(value);
              inClicked ? setInStock(numValue) : setOutStock(numValue);
            }}
            className="border-2 border-gray-300 p-2 rounded w-full text-end"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            onClick={handleInStock}
            className="bg-sky-500 text-white px-4 py-2 rounded"
          >
            {isLoading ? "Loading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
