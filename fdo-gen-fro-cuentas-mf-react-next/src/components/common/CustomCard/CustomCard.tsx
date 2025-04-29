import React from "react";

import styles from "./CustomCard.module.scss";

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: any;
  className?: string | undefined;
}

export const CustomCard = ({
  children,
  className,
  ...props
}: CustomCardProps) => {
  return (
    <div className={`${styles.customCardContainer} ${className}`} {...props}>
      {children}
    </div>
  );
};
