"use client";
import Link from "next/link";
import { MouseEvent } from "react";

type Props = {
  path: string;
  label: string;
  onClick?: () => void;
};

const Breadcrumb = ({ path, label, onClick }: Props) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={path}
      onClick={handleClick}
      className="mx-1 rounded-sm p-1 text-lg font-normal"
    >
      {label}
    </Link>
  );
};

export default Breadcrumb;
