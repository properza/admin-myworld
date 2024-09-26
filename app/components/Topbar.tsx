import { Link } from "@remix-run/react";

interface TopbarProps {
  title: string;
  isSubRoute: boolean;
  returnRoute: string;
}

export default function Topbar({
  title,
  isSubRoute,
  returnRoute,
}: TopbarProps): JSX.Element {
  return (
    <div className="flex h-12 bg-blackrose px-7 py-2.5 justify-start items-center gap-2.5 relative z-10">
      <div className="flex grow shrink basis-0 text-zinc-100 text-xl font-semibold font-['Roboto']">
        {isSubRoute ? (
          <Link to={returnRoute} className="self-center mr-2">
            <img src="/images/chevron-left.svg" alt="Back" draggable="false" />
          </Link>
        ) : null}
        {title}
      </div>

      <div className="flex items-center w-9 h-9 relative">
        <Link to="/notification">
          {" "}
          <img src="/images/bell.svg" alt="Notification" draggable="false" />
        </Link>
      </div>
    </div>
  );
}
