import { useState, useEffect } from "react"

interface DebouncedInputProps {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => setValue(initialValue), [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce])

  return (
    <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
  )
}

export default DebouncedInput;
