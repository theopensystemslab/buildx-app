import Link from "next/link";

type Props = {
  path: string;
  label: string;
  onClick?: () => void;
};

const Breadcrumb = ({ path, label, onClick }: Props) => (
  <Link
    href={path}
    onClick={onClick}
    className="mx-1 rounded-sm  p-1 text-lg font-normal"
  >
    {label}
  </Link>
);

export default Breadcrumb;
