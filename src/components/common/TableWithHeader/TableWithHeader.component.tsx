import React from "react";

import { Table } from "pendig-fro-transversal-lib-react";
import { TableProps } from "pendig-fro-transversal-lib-react/dist/components/Table/ITable";

import { CustomCard } from "../CustomCard/CustomCard";

import styles from "./TableWithHeader.module.scss";

interface TableWithHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  tableProps: TableProps<any>;
}

/**
 * A table with header and title, it's made according to UX styles and guideline.
 * It's used in CaseApproval Component and others.
 */
export const TableWithHeader = ({
  title,
  tableProps,
}: TableWithHeaderProps) => {
  return (
    <CustomCard className={styles.tableWitHeaderContainer}>
      <h3 className={styles.tableWitHeaderContainer__title}>{title}</h3>
      <Table {...tableProps} />
    </CustomCard>
  );
};
