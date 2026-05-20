import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import MDataTable from "../../components/DataGrid/MDataTable";
import { DeleteConfirmDialog } from "../../components/Modal/MConfirmDiolog";
import Header from "../../components/Header";
import MButton from "../../components/Buttons/MBtn";
import { getDoctors, deleteDoctor } from "./doctorThunks";
import { useDebounce } from "../../hooks/useDebounce";
import { specializationOptions } from ".";
import { can } from "../../utils/permissions";
import { getDoctorSchedules } from "../schedules/scheduleThunks";
import { bookAppointment } from "../appointments/appointmentThunks";
import { socket } from "../../api/axiosInstance";
import AppointmentBooking from "../../components/Modal/Hospital/AppointmentBooking";

export default function DoctorList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const doctorState = useSelector((state) => state.doctor);
  const {
    doctors = [],
    loading,
    currentPage = 1,
    limit = 10,
    totalDoctors = 0,
  } = doctorState;

  // Local state
  const [page, setPage] = useState(currentPage);
  const [rowsPerPage, setRowsPerPage] = useState(limit);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [minExperience, setMinExperience] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    doctor: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedMinFee = useDebounce(minFee, 500);
  const debouncedMaxFee = useDebounce(maxFee, 500);
  const debouncedMinExperience = useDebounce(minExperience, 500);

  const scheduleState = useSelector((state) => state.schedule);
  const schedules = scheduleState.schedules;
  const scheduleLoading = scheduleState.loading;

  const appointmentState = useSelector((state) => state.appointment);
  const bookingLoading = appointmentState.loading;
  const bookingError = appointmentState.error;
  const bookingSuccess = appointmentState.success;

  // Booking modal state
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);

  // Fetch doctors when page, filters, or search changes
  useEffect(() => {
    dispatch(
      getDoctors({
        page,
        limit: rowsPerPage,
        search: debouncedSearchTerm,
        specialization: filterValue || undefined,
        minFee: debouncedMinFee || undefined,
        maxFee: debouncedMaxFee || undefined,
        minExperience: debouncedMinExperience || undefined,
      }),
    );
  }, [
    page,
    rowsPerPage,
    debouncedSearchTerm,
    filterValue,
    debouncedMinFee,
    debouncedMaxFee,
    debouncedMinExperience,
    dispatch,
  ]);

  // Reset to first page when search or filter changes (only when debounced values change)
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearchTerm,
    filterValue,
    debouncedMinFee,
    debouncedMaxFee,
    debouncedMinExperience,
  ]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "slotBooked",

      ({ scheduleId, slotId }) => {
        dispatch(
          markSlotBooked({
            scheduleId,
            slotId,
          }),
        );
      },
    );

    socket.on(
      "slotAvailable",

      ({ scheduleId, slotId }) => {
        dispatch(
          markSlotAvailable({
            scheduleId,
            slotId,
          }),
        );
      },
    );

    return () => {
      socket.off("slotBooked");

      socket.off("slotAvailable");
    };
  }, [socket]);

  useEffect(() => {
    if (bookingSuccess) {
      setOpenBookingModal(false);
      setSelectedDate(null);
      setSelectedSlot(null);
      setBookingStep(0);
      const timer = setTimeout(() => {
        dispatch(clearAppointmentSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess, dispatch]);

  useEffect(() => {
    if (bookingError) {
      const timer = setTimeout(() => {
        dispatch(clearAppointmentError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingError, dispatch]);

  const handleBookAppointment = () => {
    setOpenBookingModal(true);
    setBookingStep(0);
  };

  const handleSelectDate = (schedule) => {
    setSelectedDate(schedule);
    setBookingStep(1);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setBookingStep(2);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!selectedDate || !selectedSlot) return;

      const appointmentData = {
        scheduleId: selectedDate._id,
        slotId: selectedSlot._id,
        doctorId: selectedDoctor._id,
      };

      dispatch(bookAppointment(appointmentData)).unwrap();
      navigate("/appointments/list");
      // window.location.href = "/appointments/list";
    } catch (error) {
      console.error("failed to book an appointment",error);
    }
  };

  const handleCloseModal = () => {
    setOpenBookingModal(false);
    setSelectedDate(null);
    setSelectedSlot(null);
    setBookingStep(0);
  };

  const getAvailableDates = () => {
    return schedules.filter((schedule) => {
      const availableSlots = schedule.slots?.filter((slot) => !slot.isBooked);
      return availableSlots && availableSlots.length > 0;
    });
  };

  const getAvailableSlotsForDate = () => {
    if (!selectedDate) return [];
    return selectedDate.slots?.filter((slot) => !slot.isBooked) || [];
  };

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        label: "Name",
        field: "fname",
        sortable: true,
        render: (row) => `${row.fname} ${row.lname}`,
      },
      // {
      //   label: "Email",
      //   field: "email",
      //   sortable: true,
      // },
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
        field: "consultationFee",
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
        field: "isActive",
        sortable: true,
        type: "boolean",
      },
    ],
    [],
  );

  // Table actions - Update and Delete
  const actions = [
    can(user.role, "doctors", "view") && {
      label: "View",
      handler: (doctor) => {
        navigate(`/doctor/detail/${doctor._id}`);
      },
    },

    can(user.role, "appointments", "create") && {
      label: "Book Appointment",
      handler: (doctor) => {
        dispatch(getDoctorSchedules(doctor._id));
        setSelectedDoctor(doctor);
        setOpenBookingModal(true);
      },
    },

    can(user.role, "doctors", "edit") && {
      label: "Edit",
      handler: (doctor) => {
        navigate(`/doctors/${doctor._id}`);
      },
    },

    can(user.role, "doctors", "delete") && {
      label: "Delete",
      handler: (doctor) => {
        setDeleteDialog({ open: true, doctor });
      },
    },
  ].filter(Boolean);

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

  const handleSearchChange = (value) => {
    // Handle both string value and event object
    const searchValue =
      typeof value === "string" ? value : value?.target?.value || "";

    setSearchTerm(searchValue);
  };

  const searchConfig = {
    placeholder: "Search by name, email, or specialization...",
    value: searchTerm,
    onChange: handleSearchChange,
  };
  // Filter configuration
  const filterConfig = {
    value: filterValue,
    onChange: setFilterValue,
    options: specializationOptions,

    customNumericFilters: {
      minFee,
      maxFee,
      minExperience,
      onMinFeeChange: setMinFee,
      onMaxFeeChange: setMaxFee,
      onMinExperienceChange: setMinExperience,
    },
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
  const availableDates = getAvailableDates();
  const availableSlots = getAvailableSlotsForDate();

  return (
    <>
      {/* Header with title and add button */}
      <Header
        title="Doctors Management"
        subtitle="Manage all doctors in the system"
        action={
          can(user.role, "doctors", "create") && (
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
                "&:hover": {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          )
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
          // getLink={(doctor) => `/doctors/${doctor._id}`}
          exportToExcel={true}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, doctor: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        question={
          "Are you sure you want to delete data? This action cannot be undone."
        }
        loading={deleteLoading}
        confirmAsync={true}
      />

      {/* Booking Modal */}
      <AppointmentBooking
        availableDates={availableDates}
        availableSlots={availableSlots}
        bookingStep={bookingStep}
        bookingLoading={bookingLoading}
        doctor={selectedDoctor}
        openBookingModal={openBookingModal}
        scheduleLoading={scheduleLoading}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        theme={theme}
        setBookingStep={setBookingStep}
        handleCloseModal={handleCloseModal}
        handleConfirmBooking={handleConfirmBooking}
        handleSelectDate={handleSelectDate}
        handleSelectSlot={handleSelectSlot}
      />
    </>
  );
}
