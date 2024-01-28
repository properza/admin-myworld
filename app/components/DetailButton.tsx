import { Link } from "@remix-run/react";

interface DetailButtonProps {
  to: string
}

function DetailButton ({ to }: DetailButtonProps): JSX.Element {
  return (
    <Link to={to} className="h-6 px-1.5 py-0.5 bg-white rounded border border-sky-400 justify-start items-center gap-1 inline-flex">
      <p className="text-sky-400 text-xs font-normal font-roboto">ดูรายละเอียด</p>
      <img src="/images/chevron-down.svg" alt="More options" className="w-2 h-2 justify-center items-center" draggable="false" />
    </Link>
  )
}

export default DetailButton;
