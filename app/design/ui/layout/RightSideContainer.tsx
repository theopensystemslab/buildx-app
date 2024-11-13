import css from "./RightSideContainer.module.css";

interface RightSideContainerProps {
  children: React.ReactNode;
}

const RightSideContainer = ({ children }: RightSideContainerProps) => {
  return <div className={css.root}>{children}</div>;
};

export default RightSideContainer;
