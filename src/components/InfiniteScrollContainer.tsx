import { useInView } from "react-intersection-observer";

interface InfiniteScroolProps extends React.PropsWithChildren {
  onButtomReached: () => void;
  classname?: string;
}

import React from "react";

const InfiniteScrollContainer = ({
  children,
  classname,
  onButtomReached,
}: InfiniteScroolProps) => {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onButtomReached();
      }
    },
  });
  return (
    <div className={classname}>
      {children}
      <div ref={ref} />
    </div>
  );
};

export default InfiniteScrollContainer;
