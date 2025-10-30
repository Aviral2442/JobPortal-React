import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import TablePagination from "@/components/table/TablePagination";

const tableConfig = {
  1: {
    endpoint: "/job-categories/get_job_category_list",
    columns: categoryColumns,
  },
  2: {
    endpoint: "/job-categories/get_job_subcategory_list",
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 1,
  });

  const { endpoint, columns } = tableConfig[tabKey];

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${endpoint}?page=${page}`);
      console.log("Fetched data:", res.data);

      let data = [];
      let info = {
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 1,
      };

      switch (tabKey) {
        case 1:
          data = res.data?.jsonData?.data || [];
          info = {
            limit: res.data?.jsonData?.limit || 10,
            page: res.data?.jsonData?.page || 1,
            total: res.data?.jsonData?.total || 0,
            totalPages: res.data?.jsonData?.totalPages || 1,
          };
          break;
        case 2:
          data = res.data?.jsonData?.data || [];
          info = {
            limit: res.data?.jsonData?.limit || 10,
            page: res.data?.jsonData?.page || 1,
            total: res.data?.jsonData?.total || 0,
            totalPages: res.data?.jsonData?.totalPages || 1,
          };
          break;
        default:
          data = res.data?.data || [];
          info = {
            limit: res.data?.limit || 10,
            page: res.data?.page || 1,
            total: res.data?.total || 0,
            totalPages: res.data?.totalPages || 1,
          };
      }

      setRows(data);
      setPaginationInfo(info);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
      setPaginationInfo({
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [tabKey, refreshFlag, currentPage]);

  const handleDelete = async (rowData) => {
    let id;
    let name;
    let deleteEndpoint;

    switch (tabKey) {
      case 1:
        id = rowData._id;
        name = rowData.category_name || rowData.categoryName;
        deleteEndpoint = `/job-categories/${id}`;
        break;
      case 2:
        id = rowData._id;
        name = rowData.subCategoryName;
        deleteEndpoint = `/job-categories/subcategories/${id}`;
        break;
      default:
        return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(deleteEndpoint);
      alert("Deleted successfully!");
      onDataChanged();
      fetchData(currentPage);
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
    const newPage = newPageIndex + 1;
    setSearchParams({ page: newPage.toString() });
  };

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
                  topEnd: null,
                  bottomStart: null,
                  bottomEnd: null,
                },
                buttons: [
                  { extend: "copy", className: "btn btn-sm btn-secondary" },
                  { extend: "csv", className: "btn btn-sm btn-secondary" },
                  { extend: "excel", className: "btn btn-sm btn-secondary" },
                  { extend: "pdf", className: "btn btn-sm btn-secondary" },
                ],
                paging: false,
                info: false,
                ordering: true,
                searching: true,
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
                currentPage={paginationInfo.page}
                totalPages={paginationInfo.totalPages}
                itemsName="items"
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