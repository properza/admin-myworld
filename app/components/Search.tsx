import { cn } from "~/tailwind";

import DebouncedInput from "./DebouncedInput";

interface SearchProps {
  className?: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function Search({
  className,
  filter,
  setFilter,
}: SearchProps): JSX.Element {
  return (
    <div
      className={cn(
        "w-36 h-10 px-2 py-1 bg-white rounded-lg border border-sky-400 justify-between items-center gap-1 inline-flex",
        className,
      )}
    >
      <div className="w-5 h-5 justify-center items-center flex">
        <img
          src="/images/search.svg"
          alt="Search"
          className="w-5 h-5 relative flex-col justify-start items-start flex"
          draggable="false"
        />
      </div>

      <DebouncedInput
        value={filter ?? ""}
        onChange={(value) => setFilter(String(value))}
        className="w-[6.25rem] focus:ring-transparent text-sky-400 text-base font-normal font-inter leading-normal"
        placeholder="Search"
      />
    </div>
  );
}
