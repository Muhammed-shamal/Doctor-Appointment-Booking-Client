import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, useTheme } from "@mui/material";
import MDataTable from "../../components/DataGrid/MDataTable";
import Header from "../../components/Header";
import { DeleteConfirmDialog } from "../../components/Modal/MConfirmDiolog";
import MButton from "../../components/Buttons/MBtn";
import {
  getMyAppointments,
  updateAppointmentStatus,
} from "./appointmentThunks";
import { useNavigate } from "react-router-dom";

export default function AppointmentList() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const appointmentState = useSelector((state) => state.appointment);
  const { appointments, loading } = appointmentState;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    appointment: null,
  });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  const handlePageChange = (newPage) => setPage(newPage);

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
        label: "Appointment Date",
        field: "appointmentDate",
        sortable: true,
        isDate: true,
        render: (row) =>
          row.appointmentDate
            ? new Date(row.appointmentDate).toLocaleDateString()
            : "",
      },
      {
        label: "Time",
        field: "slotStartTime",
        render: (row) =>
          `${row.slotStartTime || ""}${row.slotEndTime ? ` - ${row.slotEndTime}` : ""}`,
      },
      {
        label: "Status",
        field: "status",
        type: "status",
        sortable: true,
      },
      {
        label: "Booked At",
        field: "createdAt",
        render: (row) =>
          row.createdAt ? new Date(row.createdAt).toLocaleString() : "",
      },
    ],
    [],
  );

  const actions = [
    // {
    //   label: "View",
    //   handler: (appointment) => {
    //     navigate(`/appointment/detail/${appointment._id}`);
    //   },
    // },
    {
      label: "Cancel",
      handler: (appointment) => setCancelDialog({ open: true, appointment }),
      visible: (appt) =>
        appt.status !== "cancelled" && appt.status !== "completed",
    },
  ];

  const handleCancelConfirm = async () => {
    if (!cancelDialog.appointment) return;
    try {
      setCancelLoading(true);
      await dispatch(
        updateAppointmentStatus({
          appointmentId: cancelDialog.appointment._id,
          status: "cancelled",
        }),
      ).unwrap();
      setCancelDialog({ open: false, appointment: null });
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    } finally {
      setCancelLoading(false);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil((appointments?.length || 0) / rowsPerPage),
  );

  return (
    <>
      <Header
        title="My Appointments"
        subtitle="View and manage your appointments"
        action={
          <Box>
            <MButton
              label="Refresh"
              onClick={() => dispatch(getMyAppointments())}
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: "0.79rem",
                px: 2,
                py: 0.7,
              }}
            />
          </Box>
        }
      />

      <Box sx={{ mt: 3 }}>
        <MDataTable
          data={appointments}
          loading={loading}
          columns={columns}
          actions={actions}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          title="Appointments"
        />
      </Box>

      <DeleteConfirmDialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, appointment: null })}
        onConfirm={handleCancelConfirm}
        title="Cancel Appointment"
        question={"Are you sure you want to cancel this appointment?"}
        loading={cancelLoading}
        confirmAsync={true}
      />
    </>
  );
}
