import React from "react";

import { DataBox } from "../DataBox/DataBox.component";

import styles from "./DataboxIterator.module.scss";

interface IDataboxIteratorProps extends React.HTMLAttributes<HTMLDivElement> {
  itemsArray: { title: string; value: string }[];
}

export const DataboxIterator = ({
  itemsArray,
  ...props
}: IDataboxIteratorProps) => {
  return (
    <div className={styles.databoxIteratorContainer} {...props}>
      {itemsArray.map((element) => (
        <DataBox
          key={element.title}
          label={element.title}
          value={element.value}
        />
      ))}
    </div>
  );
};
