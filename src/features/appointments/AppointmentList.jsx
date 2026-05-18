import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, useTheme } from "@mui/material";
import MDataTable from "../../components/DataGrid/MDataTable";
import Header from "../../components/Header";
import { DeleteConfirmDialog } from "../../components/Modal/MConfirmDiolog";
import MButton from "../../components/Buttons/MBtn";
import {
  cancelAppointment,
  getMyAppointments,
  updateAppointmentStatus,
} from "./appointmentThunks";
import { useNavigate } from "react-router-dom";
import { can } from "../../utils/permissions";
import { UpdateStatusDialog } from "../../components/Modal/Hospital/UpdateAppointmentStatus";
import { socket } from "../../api/axiosInstance";

export default function AppointmentList() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const appointmentState = useSelector((state) => state.appointment);
  const { appointments, loading } = appointmentState;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    appointment: null,
  });
  const [cancelLoading, setCancelLoading] = useState(false);

  const [updateDialog, setUpdateDialog] = useState({
    open: false,
    appointment: null,
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "appointmentUpdated",

      () => {
        console.log('triggeritn pont')
        dispatch(getMyAppointments());
      },
    );

    return () => {
      socket.off("appointmentUpdated");
    };
  }, [socket, dispatch]);

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
    can(user.role, "appointments", "edit") && {
      label: "Update Status",
      handler: (appointment) => {
        setUpdateDialog({ open: true, appointment });
      },
    },

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
        cancelAppointment({
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

  const handleUpdateConfirm = async (status) => {
    if (!updateDialog.appointment) return;

    try {
      setUpdateLoading(true);

      let response = await dispatch(
        updateAppointmentStatus({
          appointmentId: updateDialog.appointment._id,
          status,
        }),
      ).unwrap();

      setUpdateDialog({
        open: false,
        appointment: null,
      });
    } catch (err) {
      console.error("Failed to update appointment", err);
    } finally {
      setUpdateLoading(false);
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

      <UpdateStatusDialog
        open={updateDialog.open}
        onClose={() =>
          setUpdateDialog({
            open: false,
            appointment: null,
          })
        }
        onConfirm={handleUpdateConfirm}
        loading={updateLoading}
        appointment={updateDialog.appointment}
      />
    </>
  );
}
