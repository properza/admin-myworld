function EmptyState(): JSX.Element {
  return (
    <div className="flex flex-col items-center w-24 h-16">
      <img
        className="w-16 h-16"
        src="/images/inbox.svg"
        alt="Inbox"
        draggable="false"
      />
      <p className="text-xl text-blackrose text-center font-roboto font-bold">
        ไม่มีข้อมูล
      </p>
    </div>
  );
}

export default EmptyState;
