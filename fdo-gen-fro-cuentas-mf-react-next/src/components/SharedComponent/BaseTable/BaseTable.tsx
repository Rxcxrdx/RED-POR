import React, { useMemo, useState } from "react";
import { Button, Table } from "pendig-fro-transversal-lib-react";
import { BoxMessage, Loader } from "@/components/common";
import { BaseTableProps } from "./IBaseTable";

export const BaseTable: React.FC<BaseTableProps> = ({
  columns,
  page,
  setPage,
  records,
  totalRecords,
  errorMessage,
  isLoading,
  handleDownload,
  downloadable,
  titleButtonDownload,
}) => {

  const [pageSize, setPageSize] = useState<number>(20);
    
  const paginatedRecords = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return records.slice(startIndex, startIndex + pageSize);
  }, [records, page, pageSize]);


  const itemsPerPageOptions = [10, 20, 50, 100];

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          gap: "16px",
          width: "100%",
          padding: "0px 0px 16px 0px",
        }}
      >
        {records && downloadable ? (
          <>
            <Button
              onClick={handleDownload}
              $color="primary"
              $size="small"
              data-testid="csv-download-contributions"
            >
              {titleButtonDownload}
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>
        <Loader isLoading={isLoading} />
        {errorMessage ? (
          <BoxMessage data-testid="error-message" errorMessage={errorMessage} />
        ) : (
            <Table<any>
            $data={paginatedRecords}
            $columns={columns}
            $currentPage={page}
            $totalPages={Math.ceil(records.length / pageSize)}
            $itemsPerPage={pageSize}
            $totalItems={records.length}
            $onPageChange={setPage}
            $itemsPerPageOptions={itemsPerPageOptions}
            $onItemsPerPageChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        )}
    </>
  );
};
