import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import MDataTable from "../../components/DataGrid/MDataTable";
import Header from "../../components/Header";
import MButton from "../../components/Buttons/MBtn";
import { getDoctors } from "../doctors/doctorThunks";
import { deleteSchedule, getDoctorSchedules } from "./scheduleThunks";
import { DeleteConfirmDialog } from "../../components/Modal/MConfirmDiolog";

export default function ScheduleList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const doctorState = useSelector((state) => state.doctor || {});
  const doctors = doctorState.doctors || [];
  const loadingDoctors = doctorState.loading || false;

  const scheduleState = useSelector((state) => state.schedule || {});
  const { schedules = [], loading = false } = scheduleState;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    schedule: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!doctors || doctors.length === 0) dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(getDoctorSchedules(selectedDoctor));
    } else if (doctors && doctors.length > 0) {
      // default to first doctor if none selected
      const first = doctors[0]._id;
      setSelectedDoctor(first);
      dispatch(getDoctorSchedules(first));
    }
  }, [selectedDoctor, doctors, dispatch]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleDoctorFilterChange = (value) => {
    setSelectedDoctor(value);
    setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        label: "Doctor",
        field: "doctor.fname",
        render: (row) =>
          `${row.doctor?.fname || ""} ${row.doctor?.lname || ""}`.trim(),
        sortable: true,
      },
      {
        label: "Date",
        field: "date",
        sortable: true,
        isDate: true,
        render: (row) =>
          row.date ? new Date(row.date).toLocaleDateString() : "",
      },
      // {
      //   label: "Start Time",
      //   field: "startTime",
      //   sortable: false,
      // },
      // {
      //   label: "End Time",
      //   field: "endTime",
      //   sortable: false,
      // },
      {
        label: "Slot Duration (min)",
        field: "slotDuration",
        sortable: true,
        type: "number",
      },
    ],
    [],
  );

  // Table actions - Update and Delete
  const actions = [
    {
      label: "Edit",
      handler: (schedule) => {
        navigate(`/schedules/${schedule._id}`);
      },
    },
    {
      label: "Delete",
      handler: (schedule) => {
        setDeleteDialog({ open: true, schedule });
      },
    },
  ];

  const doctorOptions = doctors.map((d) => ({
    label: `${d.fname || ""} ${d.lname || ""}`.trim(),
    value: d._id,
  }));

  // const searchConfig = {
  //   placeholder: "Search schedules...",
  //   value: "",
  //   onChange: () => {},
  // };

  const filterConfig = {
    value: selectedDoctor,
    onChange: handleDoctorFilterChange,
    options: doctorOptions,
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.schedule) return;

    try {
      setDeleteLoading(true);
      await dispatch(deleteSchedule(deleteDialog.schedule._id)).unwrap();
      setDeleteDialog({ open: false, schedule: null });
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil((schedules?.length || 0) / rowsPerPage) || 1;

  return (
    <>
      <Header
        title="Schedules"
        subtitle="Manage doctor schedules"
        action={
          <MButton
            label="Add New Schedule"
            onClick={() => navigate("/schedules/new")}
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

      <Box sx={{ mt: 3 }}>
        <MDataTable
          data={schedules}
          loading={loading || loadingDoctors}
          columns={columns}
          page={page}
          actions={actions}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          // search={searchConfig}
          filters={filterConfig}
          title="Schedules List"
          exportToExcel={true}
        />
      </Box>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, schedule: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Schedule"
        question={
          "Are you sure you want to delete data? This action cannot be undone."
        }
        loading={deleteLoading}
        confirmAsync={true}
      />
    </>
  );
}
