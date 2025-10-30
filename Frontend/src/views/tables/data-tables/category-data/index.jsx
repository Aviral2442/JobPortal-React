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

const tableConfig = {
  1: {
    endpoint: "/categories/",
    columns: categoryColumns,
  },
  2: {
    endpoint: "/subcategories/",
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

  const { endpoint, columns } = tableConfig[tabKey];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(endpoint);
      console.log("Fetched data:", res.data);

      switch (tabKey) {
        case 1:
          setRows(res.data?.data || []);
          break;
        case 2:
          setRows(res.data || []);
          break;
        default:
          setRows(res.data?.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tabKey, refreshFlag]);

  const handleDelete = async (rowData) => {
    let id;
    let name;
    let deleteEndpoint;

    switch (tabKey) {
      case 1:
        id = rowData._id;
        name = rowData.categoryName;
        deleteEndpoint = `/categories/${id}`;
        break;
      case 2:
        id = rowData._id;
        name = rowData.subCategoryName;
        deleteEndpoint = `/subcategories/${id}`;
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
        return meta.row + 1;
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

  return (
    <>
      <ComponentCard
        title={tabKey === 1 ? "Category" : "Sub Category"}
        className="mb-4"
        onAddNew={onAddNew}
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
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
              paging: true,
              ordering: true,
              searching: true,
              pageLength: 10,
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
        )}
      </ComponentCard>
    </>
  );
};

export default ExportDataWithButtons;