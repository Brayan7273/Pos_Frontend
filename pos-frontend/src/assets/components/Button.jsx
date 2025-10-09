import { cva } from "class-variance-authority";

const button = cva(
  "px-4 py-2 rounded-md font-semibold transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

export default function Button({ intent, children, ...props }) {
  return (
    <button className={button({ intent })} {...props}>
      {children}
    </button>
  );
}
