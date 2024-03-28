const UsernameSection = ({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string | null | undefined;
}): JSX.Element => {
  return (
    <div className="flex">
      <div className="mr-3 justify-start items-center gap-2.5 flex">
        <img
          className="w-7 h-7 rounded-full border border-gray-400"
          src={imageUrl ? imageUrl : "/images/avatar.svg"}
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
