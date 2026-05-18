import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import MDataTable from "../../components/DataGrid/MDataTable";
import { DeleteConfirmDialog } from "../../components/Modal/MConfirmDiolog";
import Header from "../../components/Header";
import MButton from "../../components/Buttons/MBtn";
import { useDebounce } from "../../hooks/useDebounce";
import { getPatients } from "./patientThunk";

export default function PatientList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // Redux state
  const patientState = useSelector((state) => state.patient);
  const { patients, loading, currentPage, limit, totalPatients } = patientState;

  // Local state
  const [page, setPage] = useState(currentPage);
  const [rowsPerPage, setRowsPerPage] = useState(limit);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch Patients when page, filters, or search changes
  useEffect(() => {
    dispatch(
      getPatients({
        page,
        limit: rowsPerPage,
        search: debouncedSearchTerm,
      }),
    );
  }, [page, rowsPerPage, debouncedSearchTerm, filterValue, dispatch]);

  // Reset to first page when search or filter changes (only when debounced values change)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filterValue]);

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        label: "Name",
        field: "name",
        sortable: true,
      },
      {
        label: "Email",
        field: "email",
        sortable: true,
      },
      {
        label: "Phone",
        field: "phone",
        sortable: true,
      },
    ],
    [],
  );

  // Table actions - Update and Delete
  //   const actions = [
  //     {
  //       label: "View",
  //       handler: (patient) => {
  //         navigate(`/patient/detail/${patient._id}`);
  //       },
  //     },
  //   ];

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (value) => {
    // Handle both string value and event object
    const searchValue =
      typeof value === "string" ? value : value?.target?.value || "";

    setSearchTerm(searchValue);
  };

  const searchConfig = {
    placeholder: "Search by name, email, or phone...",
    value: searchTerm,
    onChange: handleSearchChange,
  };
  // Filter configuration
  const filterConfig = {
    value: filterValue,
    onChange: setFilterValue,
    options: [{ label: "", value: "" }],
  };

  // Sort configuration
  const sortConfig = {
    value: "",
    onChange: (value) => {
      // Sort is handled by MDataTable's built-in sorting
    },
    options: [
      { label: "Name (A-Z)", value: "firstName" },
      { label: "Experience (High to Low)", value: "-experience" },
      { label: "Recently Added", value: "-createdAt" },
    ],
  };

  const totalPages = Math.ceil(totalPatients / rowsPerPage);

  return (
    <>
      {/* Header with title and add button */}
      <Header
        title="Patients List"
        subtitle="You can see all the patients in the system"
      />

      {/* Data Table */}
      <Box sx={{ mt: 3 }}>
        <MDataTable
          data={patients}
          loading={loading}
          columns={columns}
          // actions={actions}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          search={searchConfig}
          // filters={filterConfig}
          sort={sortConfig}
          title="Patient List"
          exportToExcel={true}
        />
      </Box>
    </>
  );
}
