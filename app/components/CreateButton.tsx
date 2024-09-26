function CreateButton(): JSX.Element {
  return (
    <button className="flex bg-[#28b7e1] w-32 rounded-lg justify-center items-center px-2 py-1 gap-x-1">
      <img
        src="/images/plus.svg"
        alt="Plus"
        className="w-5 h-5"
        draggable="false"
      />
      <p className="text-white text-base">Create</p>
    </button>
  );
}

export default CreateButton;
