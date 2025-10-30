const basePath = import.meta.env.VITE_PATH;

export const categoryColumns = [
  { data: "_id", title: "Category ID" },
  { data: "categoryName", title: "Name" },
  {
    data: "categoryImage",
    title: "Image",
    render: (data) => {
      if (!data) return "No Image";
      return `<img src="${basePath}${data}" alt="Category Image" style="width: 50px; height: auto;" />`;
    },
  },
  {
    data: "categoryStatus",
    title: "Status",
    render: (data) => {
      if (data == 0 || data === "active") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1 || data === "inactive") {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    },
  },
];

export const subCategoryColumns = [
  { data: "_id", title: "Sub Category ID" },
  { data: "category.categoryName", title: "Category Name", defaultContent: "N/A" },
  { data: "subCategoryName", title: "Sub Category Name" },
  {
    data: "subCategoryImage",
    title: "Image",
    render: (data) => {
      if (!data) return "No Image";
      return `<img src="${basePath}${data}" alt="Sub Category Image" style="width: 50px; height: auto;" />`;
    },
  },
  {
    data: "subCategoryStatus",
    title: "Status",
    render: (data) => {
      if (data == 0 || data === "active") {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 1 || data === "inactive") {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">Deleted</span>`;
      }
    },
  },
];