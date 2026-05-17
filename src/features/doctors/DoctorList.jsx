import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import MDataTable from "../../components/DataGrid/MDataTable";
import { DeleteConfirmDialog } from "../../components/Modal/MConfirmDiolog";
import Header from "../../components/Header";
import MButton from "../../components/Buttons/MBtn";
import { getDoctors, deleteDoctor } from "./doctorThunks";
import { clearDoctorSuccess, clearDoctorError } from "./doctorSlice";
import { useToast } from "../../context/SnackBar";

export default function DoctorList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const Toast = useToast();

  // Redux state
  const doctorState = useSelector((state) => state.doctor || {});
  const { doctors = [], loading, error, success, currentPage = 1, limit = 10, totalDoctors = 0 } = doctorState;

  // Local state
  const [page, setPage] = useState(currentPage);
  const [rowsPerPage, setRowsPerPage] = useState(limit);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, doctor: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch doctors when page or rowsPerPage changes
  useEffect(() => {
    dispatch(
      getDoctors({
        page,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterValue || undefined,
      })
    );
  }, [page, rowsPerPage, searchTerm, filterValue, dispatch]);

  // Clear success/error notifications after 3 seconds
  useEffect(() => {
    if (success) {
      Toast(success, "success");
      dispatch(clearDoctorSuccess());
    }
  }, [success, dispatch, Toast]);

  useEffect(() => {
    if (error) {
      Toast(error, "error");
      dispatch(clearDoctorError());
    }
  }, [error, dispatch, Toast]);

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        label: "Name",
        field: "firstName",
        sortable: true,
        render: (row) => `${row.firstName} ${row.lastName}`,
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
      {
        label: "Specialization",
        field: "specialization",
        sortable: true,
      },
      {
        label: "Experience",
        field: "experience",
        sortable: true,
        type: "number",
      },
      {
        label: "Consultation Fee",
        field: "consultation_fee",
        sortable: true,
        type: "number",
      },
      {
        label: "Clinic Name",
        field: "clinic_name",
        sortable: true,
      },
      {
        label: "Status",
        field: "is_active",
        sortable: true,
        type: "boolean",
      },
    ],
    []
  );

  // Table actions - Update and Delete
  const actions = [
    {
      label: "Edit",
      handler: (doctor) => {
        navigate(`/doctors/${doctor._id}`);
      },
    },
    {
      label: "Delete",
      handler: (doctor) => {
        setDeleteDialog({ open: true, doctor });
      },
    },
  ];

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.doctor) return;

    try {
      setDeleteLoading(true);
      await dispatch(deleteDoctor(deleteDialog.doctor._id)).unwrap();
      setDeleteDialog({ open: false, doctor: null });
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Search configuration
  const searchConfig = {
    placeholder: "Search by name, email, or specialization...",
    onChange: (e) => {
      setSearchTerm(e.target.value);
      setPage(1); // Reset to first page when searching
    },
  };

  // Filter configuration
  const filterConfig = {
    value: filterValue,
    onChange: (value) => {
      setFilterValue(value);
      setPage(1); // Reset to first page when filtering
    },
    options: [
      { label: "All Doctors", value: "" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
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

  const totalPages = Math.ceil(totalDoctors / rowsPerPage);

  return (
    <>
      {/* Header with title and add button */}
      <Header
        title="Doctors Management"
        subtitle="Manage all doctors in the system"
        action={
          <MButton
            label="Add New Doctor"
            onClick={() => navigate("/doctors/new")}
            sx={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: "0.79rem",
              px: 3,
              py: 1,
              "&:hover": { backgroundColor: theme.palette.background.paper },
            }}
          />
        }
      />

      {/* Data Table */}
      <Box sx={{ mt: 3 }}>
        <MDataTable
          data={doctors}
          loading={loading}
          columns={columns}
          actions={actions}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          search={searchConfig}
          filters={filterConfig}
          sort={sortConfig}
          title="Doctors List"
          getLink={(doctor) => `/doctors/${doctor._id}`}
          exportToExcel={true}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, doctor: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        question={`Are you sure you want to delete ${deleteDialog.doctor?.firstName} ${deleteDialog.doctor?.lastName}? This action cannot be undone.`}
        loading={deleteLoading}
        confirmAsync={true}
      />
    </>
  );
}
