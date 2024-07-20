import { cn } from "~/tailwind";

interface DropdownSelectProps {
  className?: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  options: any[];
}

export default function DropdownSelect({
  className,
  selected,
  setSelected,
  options,
}: DropdownSelectProps): JSX.Element {
  return (
    <div
      className={cn(
        "w-36 h-10 px-2 py-1 bg-white rounded-lg border border-sky-400 justify-between items-center gap-1 inline-flex",
        className,
      )}
    >
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className=""
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
