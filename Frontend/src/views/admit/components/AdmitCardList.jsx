// const page =() =>{
//     return <div>Admit Card Page</div>
// }
// export default page;


import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "react-bootstrap";

import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

import ReactDOMServer from "react-dom/server";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbDotsVertical,
  TbEdit,
  TbTrash,
} from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import {
  categoryColumns,
  subCategoryColumns,
} from "@/views/tables/data-tables/category-data/components/category.js";

import { createRoot } from "react-dom/client";
import axios from "@/api/axios";
import TablePagination from "@/components/table/TablePagination"; // Import the pagination component

const tableConfig = {
  1: {
    endpoint: "/job-categories/get_job_category_list",
    columns: categoryColumns,
  },
  2: {
    endpoint: "/jon-categories/get_job_subcategory_list",
    columns: subCategoryColumns,
  },
};

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const ExportDataWithButtons = ({
  tabKey,
  onAddNew,
  onEditRow,
  refreshFlag,
  onDataChanged,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Start at page 1
  const [paginationInfo, setPaginationInfo] = useState({});

  const { endpoint, columns } = tableConfig[tabKey];

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(${endpoint}?page=${page});
      console.log("Fetched data:", res.data);

      let data = [];
      let info = {};

      switch (tabKey) {
        case 1:
          data = res.data?.jsonData?.data || [];
          info = {
            limit: res.data?.jsonData?.limit,
            page: res.data?.jsonData?.page,
            total: res.data?.jsonData?.total,
            totalPages: res.data?.jsonData?.totalPages,
          };
          break;
        case 2:
          data = res.data?.data || [];
          info = {
            limit: res.data?.limit,
            page: res.data?.page,
            total: res.data?.total,
            totalPages: res.data?.totalPages,
          };
          break;
        default:
          data = res.data?.data || [];
          info = {
            limit: res.data?.limit,
            page: res.data?.page,
            total: res.data?.total,
            totalPages: res.data?.totalPages,
          };
      }

      setRows(data);
      setPaginationInfo(info);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
      setPaginationInfo({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [tabKey, refreshFlag, currentPage]); // Refetch on page change

  const handleDelete = async (rowData) => {
    let id;
    let name;
    let deleteEndpoint;

    switch (tabKey) {
      case 1:
        id = rowData._id;
        name = rowData.categoryName;
        deleteEndpoint = /job-categories/${id};
        break;
      case 2:
        id = rowData._id;
        name = rowData.subCategoryName;
        deleteEndpoint = /subcategories/${id};
        break;
      default:
        return;
    }

    const confirmed = window.confirm(
      Are you sure you want to delete "${name}"?
    );
    if (!confirmed) return;

    try {
      await axios.delete(deleteEndpoint);
      alert("Deleted successfully!");
      onDataChanged();
      fetchData(currentPage); // Refetch current page after delete
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  const columnsWithActions = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (data, type, row, meta) => {
        // Adjust S.No. based on current page and limit
        return (paginationInfo.page - 1) * paginationInfo.limit + meta.row + 1;
      },
    },
    ...columns,
    {
      title: "Actions",
      data: null,
      orderable: false,
      searchable: false,
      render: () => "",
      createdCell: (td, cellData, rowData) => {
        const root = createRoot(td);
        root.render(
          <Dropdown align="end">
            <DropdownToggle
              variant="link"
              className="drop-arrow-none fs-xxl link-reset p-0"
            >
              <TbDotsVertical />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => onEditRow(rowData)}>
                <TbEdit className="me-2" />
                Edit
              </DropdownItem>
              <DropdownItem onClick={() => handleDelete(rowData)}>
                <TbTrash className="me-2" />
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  const handlePageChange = (newPageIndex) => {
    setCurrentPage(newPageIndex + 1); // TablePagination uses 0-based index, backend uses 1-based
  };

  const start =
    (paginationInfo.page - 1) * paginationInfo.limit + 1;

  const end = Math.min(
    paginationInfo.page * paginationInfo.limit,
    paginationInfo.total
  );

  return (
    <>
      <ComponentCard
        title={tabKey === 1 ? "Category" : "Sub Category"}
        className="mb-4 pb-3"
        onAddNew={onAddNew}
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <>
            <DataTable
              data={rows}
              columns={columnsWithActions}
              options={{
                responsive: true,
                layout: {
                  topStart: "buttons",
                },
                buttons: [
                  { extend: "copy", className: "btn btn-sm btn-secondary" },
                  { extend: "csv", className: "btn btn-sm btn-secondary" },
                  { extend: "excel", className: "btn btn-sm btn-secondary" },
                  { extend: "pdf", className: "btn btn-sm btn-secondary" },
                ],
                paging: false, // Disable DataTable's paging
                ordering: true,
                searching: true,
                pageLength: paginationInfo.limit, // Set to backend limit
                language: {
                  paginate: {
                    first: ReactDOMServer.renderToStaticMarkup(
                      <TbChevronsLeft />
                    ),
                    previous: ReactDOMServer.renderToStaticMarkup(
                      <TbChevronLeft />
                    ),
                    next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight />),
                    last: ReactDOMServer.renderToStaticMarkup(
                      <TbChevronsRight />
                    ),
                  },
                },
              }}
              className="table table-striped dt-responsive w-100"
            />
            {paginationInfo.total > 0 && (
              <TablePagination
                totalItems={paginationInfo.totalPages}
                start={end}
                end={currentPage}
                itemsName="pages"
                showInfo={true}
                previousPage={() => handlePageChange(currentPage - 2)} 
                canPreviousPage={currentPage > 1}
                pageCount={paginationInfo.totalPages}
                pageIndex={currentPage - 1} 
                setPageIndex={handlePageChange}
                nextPage={() => handlePageChange(currentPage)} 
                canNextPage={currentPage < paginationInfo.totalPages}
              />
            )}
          </>
        )}
      </ComponentCard>
    </>
  );
};

export default ExportDataWithButtons;