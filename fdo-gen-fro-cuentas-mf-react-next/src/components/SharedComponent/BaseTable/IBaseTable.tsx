export interface Column {
    $key: any;
    $header: string;
    $format?: (value: any) => string;
    $render?: any;
    $isLink?: boolean,
    $linkPath?: (value: any) => any,
    $onClick?: () => void,
  }

export interface BaseTableProps {  
    columns: Column[];
    page: number;
    pageSize: number;
    isLoading: boolean;
    totalRecords: number;
    records: any[];
    setPage: (page: number) => void;    
    titleButtonDownload?: string;
    downloadable?: boolean;
    // handleItemsPerPageChange: (size: number) => void;
    // setPageSize: (size: number) => void;
    errorMessage: string;
    handleDownload?: () => void;
  }