import { useState } from "react";

const UsernameSection = ({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string | null | undefined;
}): JSX.Element => {
  
  const [imgSrc, setImgSrc] = useState(imageUrl || "/images/avatar.svg");

  const handleError = () => {
    setImgSrc("/images/avatar.svg"); // replace with your local icon path
  };

  return (
    <div className="flex">
      <div className="mr-3 justify-start items-center gap-2.5 flex">
        <img
          className="w-7 h-7 rounded-full border border-gray-400"
          src={imgSrc}
          onError={handleError}
          alt={name ? name : "Avatar"}
          draggable="false"
        />
      </div>
      <div className="self-center text-stone-800 text-sm font-normal font-roboto">
        {name}
      </div>
    </div>
  );
};

export default UsernameSection;
