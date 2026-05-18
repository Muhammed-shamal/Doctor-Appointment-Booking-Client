import { useMemo, useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableSortLabel,
  TableRow,
  Menu,
  MenuItem,
  IconButton,
  Skeleton,
  Button,
  Typography,
  Box,
  TablePagination,
  Tooltip,
  FormControlLabel,
  Switch,
  Chip,
  FormControl,
  TextField,
  Select,
  InputAdornment,
  alpha,
  Drawer,
  Grid,
  useMediaQuery,
  useTheme,
  Badge,
  Stack,
  Divider,
  Fab,
  Zoom,
  InputLabel,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import TuneIcon from "@mui/icons-material/Tune";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const MDataTable = ({
  data,
  loading,
  columns,
  actions,
  FileUrl,
  page,
  onPageChange,
  filters,
  sort,
  search,
  title,
  totalPages,
  rowsPerPage,
  setRowsPerPage,
  getLink,
  exportToExcel = false,
  onClearFilters,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dense, setDense] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count
  useMemo(() => {
    let count = 0;
    if (filters?.value && filters.value !== "all") count++;
    if (sort?.value && sort.value !== "") count++;
    if (search?.value && search.value !== "") count++;
    if (filters?.customDateRange?.fromDate) count++;
    if (filters?.customDateRange?.toDate) count++;
    setActiveFiltersCount(count);
  }, [filters, sort, search]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDownloadExcel = () => {
    if (!data || data.length === 0) return;

    const excelData = data.map((item) => {
      const row = {};
      columns.forEach((col) => {
        const value = getNestedValue(item, col.field);
        row[col.label] =
          col.isDate && dayjs(value).isValid()
            ? dayjs(value).format("DD/MM/YYYY")
            : value;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `data-table-export-${Date.now()}.xlsx`);
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleClearAllFilters = () => {
    if (search?.onChange) search.onChange({ target: { value: "" } });
    if (filters?.onChange) filters.onChange("all");
    if (sort?.onChange) sort.onChange("");
    if (filters?.customDateRange?.onFromDateChange)
      filters.customDateRange.onFromDateChange("");
    if (filters?.customDateRange?.onToDateChange)
      filters.customDateRange.onToDateChange("");
    if (onClearFilters) onClearFilters();

    if (filters?.customNumericFilters) {
      filters.customNumericFilters.onMinFeeChange("");
      filters.customNumericFilters.onMaxFeeChange("");
      filters.customNumericFilters.onMinExperienceChange("");
    }
  };

  const sortedData = useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, orderBy);
      const bValue = getNestedValue(b, orderBy);

      if (aValue < bValue) return orderDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return orderDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, orderBy, orderDirection]);

  const getStatusChipColor = (status) => {
    const value = status?.toLowerCase?.();
    switch (value) {
      case "pending":
        return { label: "Pending", color: "#ff9800" };
      case "confirmed":
        return { label: "Confirmed", color: "#2196f3" };
      case "delivered":
        return { label: "Delivered", color: "#4caf50" };
      case "canceled":
        return { label: "Canceled", color: "#f44336" };
      case "outofstock":
      case "out of stock":
        return { label: "Out of Stock", color: "#9e9e9e" };
      case "instock":
      case "in stock":
        return { label: "In Stock", color: "#4caf50" };
      case "low stock":
        return { label: "Low Stock", color: "#ffc107" };
      default:
        return { label: status, color: "#607d8b" };
    }
  };

  // Mobile Filters Drawer Component
  const MobileFiltersDrawer = () => (
    <Drawer
      anchor="bottom"
      open={mobileFiltersOpen}
      onClose={() => setMobileFiltersOpen(false)}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: "auto",
            maxHeight: "90vh",
            overflow: "hidden",
            px: 2,
            pt: 1.5,
            pb: 2,
          },
        },
      }}
    >
      {/* Drag Handle */}
      <Box
        sx={{
          width: 50,
          height: 5,
          bgcolor: "grey.400",
          borderRadius: 10,
          mx: "auto",
          mb: 2,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          Filters & Options
        </Typography>

        <IconButton size="small" onClick={() => setMobileFiltersOpen(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "calc(90vh - 140px)",
          pr: 0.5,
        }}
      >
        <Stack spacing={2}>
          {/* Search */}
          {search && (
            <TextField
              fullWidth
              size="small"
              placeholder={search.placeholder || "Search doctors..."}
              value={search.value || ""}
              onChange={search.onChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "background.paper",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),

                endAdornment: search.value ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() =>
                        search.onChange({
                          target: { value: "" },
                        })
                      }
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}

          {/* Filter */}
          {filters && (
            <FormControl fullWidth size="small">
              <InputLabel>Filter By</InputLabel>

              <Select
                value={filters.value}
                label="Filter By"
                onChange={(e) => filters.onChange(e.target.value)}
                sx={{
                  borderRadius: 3,
                }}
              >
                {filters.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Sort */}
          {sort && (
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>

              <Select
                value={sort.value}
                label="Sort By"
                onChange={(e) => sort.onChange(e.target.value)}
                sx={{
                  borderRadius: 3,
                }}
              >
                {sort.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Date Range */}
          {filters?.customDateRange && (
            <Stack spacing={1.5}>
              <Typography variant="body2" fontWeight={600}>
                Date Range
              </Typography>

              <TextField
                type="date"
                label="From"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={filters.customDateRange.fromDate || ""}
                onChange={(e) =>
                  filters.customDateRange?.onFromDateChange(e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />

              <TextField
                type="date"
                label="To"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={filters.customDateRange.toDate || ""}
                onChange={(e) =>
                  filters.customDateRange?.onToDateChange(e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Stack>
          )}

          {filters?.customNumericFilters && (
            <Stack spacing={1.5}>
              <Typography fontWeight={600}>Doctor Filters</Typography>

              <TextField
                fullWidth
                type="number"
                label="Min Fee"
                size="small"
                value={filters.customNumericFilters.minFee}
                onChange={(e) =>
                  filters.customNumericFilters.onMinFeeChange(e.target.value)
                }
              />

              <TextField
                fullWidth
                type="number"
                label="Max Fee"
                size="small"
                value={filters.customNumericFilters.maxFee}
                onChange={(e) =>
                  filters.customNumericFilters.onMaxFeeChange(e.target.value)
                }
              />

              <TextField
                fullWidth
                type="number"
                label="Min Experience"
                size="small"
                value={filters.customNumericFilters.minExperience}
                onChange={(e) =>
                  filters.customNumericFilters.onMinExperienceChange(
                    e.target.value,
                  )
                }
              />
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Footer Buttons */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          size="large"
          startIcon={<ClearIcon />}
          onClick={handleClearAllFilters}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Clear
        </Button>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => setMobileFiltersOpen(false)}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Apply
        </Button>
      </Stack>
    </Drawer>
  );

  // Desktop filter bar
  const DesktopFilters = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: title ? "space-between" : "flex-end",
        alignItems: "center",
        p: 2,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
        {search && (
          <TextField
            label={search.placeholder || "Search..."}
            variant="outlined"
            value={search.value || ""}
            onChange={search.onChange}
            size="small"
            sx={{
              flex: { xs: 1, sm: 2, md: 3 },
              minWidth: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-root": {
                height: "40px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: search.value && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => search.onChange({ target: { value: "" } })}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {filters && (
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <Select
              value={filters.value}
              onChange={(e) => filters.onChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">All</MenuItem>
              {filters.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {filters?.customNumericFilters && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              size="small"
              type="number"
              label="Min Fee"
              value={filters.customNumericFilters.minFee}
              onChange={(e) =>
                filters.customNumericFilters.onMinFeeChange(e.target.value)
              }
              sx={{ width: { xs: "100%", sm: 120 } }}
            />

            <TextField
              size="small"
              type="number"
              label="Max Fee"
              value={filters.customNumericFilters.maxFee}
              onChange={(e) =>
                filters.customNumericFilters.onMaxFeeChange(e.target.value)
              }
              sx={{ width: { xs: "100%", sm: 120 } }}
            />

            <TextField
              size="small"
              type="number"
              label="Min Exp"
              value={filters.customNumericFilters.minExperience}
              onChange={(e) =>
                filters.customNumericFilters.onMinExperienceChange(
                  e.target.value,
                )
              }
              sx={{ width: { xs: "100%", sm: 120 } }}
            />
          </Box>
        )}

        {sort && (
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <Select
              value={sort.value}
              onChange={(e) => sort.onChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Sort by</MenuItem>
              {sort.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {filters?.customDateRange && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              type="date"
              label="From"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.customDateRange.fromDate || ""}
              onChange={(e) =>
                filters.customDateRange?.onFromDateChange(e.target.value)
              }
              sx={{ width: { xs: "100%", sm: 140 } }}
            />
            <TextField
              type="date"
              label="To"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.customDateRange.toDate || ""}
              onChange={(e) =>
                filters.customDateRange?.onToDateChange(e.target.value)
              }
              sx={{ width: { xs: "100%", sm: 140 } }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            onClick={handleClearAllFilters}
            startIcon={<ClearIcon />}
            color="secondary"
          >
            Clear ({activeFiltersCount})
          </Button>
        )}

        {exportToExcel && data.length > 0 && (
          <Button
            variant="outlined"
            color="success"
            onClick={handleDownloadExcel}
            size="small"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
        )}
      </Box>
    </Box>
  );

  // Mobile toolbar with chips and FAB
  const MobileToolbar = () => (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {search && (
          <TextField
            placeholder={search.placeholder || "Search..."}
            variant="outlined"
            value={search.value || ""}
            onChange={search.onChange}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search.value && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => search.onChange({ target: { value: "" } })}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        <Badge badgeContent={activeFiltersCount} color="primary">
          <Button
            variant="outlined"
            onClick={() => setMobileFiltersOpen(true)}
            startIcon={<TuneIcon />}
            size="small"
          >
            Filters
          </Button>
        </Badge>
      </Stack>

      {/* Active filters chips */}
      {activeFiltersCount > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
        >
          {filters?.value && filters.value !== "all" && (
            <Chip
              label={`Filter: ${filters.options.find((f) => f.value === filters.value)?.label}`}
              size="small"
              onDelete={() => filters.onChange("all")}
            />
          )}
          {sort?.value && (
            <Chip
              label={`Sort: ${sort.options.find((s) => s.value === sort.value)?.label}`}
              size="small"
              onDelete={() => sort.onChange("")}
            />
          )}
          {search?.value && (
            <Chip
              label={`Search: ${search.value}`}
              size="small"
              onDelete={() => search.onChange({ target: { value: "" } })}
            />
          )}
        </Stack>
      )}
    </Box>
  );

  // Responsive table with horizontal scroll
  const ResponsiveTable = () => (
    <Box
      sx={{
        overflowX: "auto",
        width: "100%",
        position: "relative",
      }}
    >
      <Table
        sx={{
          minWidth: isMobile ? 600 : 750,
          "& .MuiTableCell-root": {
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
        }}
        size={dense ? "small" : "medium"}
      >
        <TableHead>
          <TableRow
            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
          >
            {columns.map((column, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  py: isMobile ? 1 : 1.5,
                }}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={
                      orderBy === column.field ? orderDirection : "asc"
                    }
                    onClick={() => handleRequestSort(column.field)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            {actions && (
              <TableCell
                align="right"
                sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((col, i) => (
                  <TableCell key={i}>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="right">
                    <Skeleton variant="circular" width={24} height={24} />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : sortedData.length > 0 ? (
            sortedData.map((item) => (
              <TableRow
                hover
                key={item._id}
                sx={{
                  "&:hover": {
                    backgroundColor: getLink
                      ? alpha(theme.palette.primary.main, 0.04)
                      : alpha(theme.palette.grey[100], 0.5),
                  },
                  cursor: getLink ? "pointer" : "default",
                }}
              >
                {columns.map((col, i) => {
                  const value = getNestedValue(item, col.field);

                  return (
                    <TableCell
                      key={col.field || i}
                      onClick={() => {
                        if (getLink) navigate(getLink(item));
                      }}
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {col.type === "boolean" ? (
                        <Chip
                          label={value ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            backgroundColor: value ? "#4caf50" : "#f44336",
                            color: "#fff",
                            fontWeight: 500,
                          }}
                        />
                      ) : col.type === "status" ? (
                        (() => {
                          const { label, color } = getStatusChipColor(value);
                          return (
                            <Chip
                              label={label}
                              size="small"
                              sx={{
                                backgroundColor: color,
                                color: "#fff",
                                fontWeight: 500,
                              }}
                            />
                          );
                        })()
                      ) : col.type === "date" || col.isDate ? (
                        dayjs(value).isValid() ? (
                          dayjs(value).format("DD/MM/YYYY")
                        ) : (
                          "Invalid Date"
                        )
                      ) : col.type === "number" ? (
                        <span
                          style={{
                            textAlign: "right",
                            display: "inline-block",
                            minWidth: 60,
                          }}
                        >
                          {Number(value).toLocaleString()}
                        </span>
                      ) : col.type === "image" ? (
                        value && FileUrl ? (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: "1px solid #ddd",
                            }}
                          >
                            <img
                              src={
                                value.startsWith("http")
                                  ? value
                                  : `${FileUrl}/${value}`
                              }
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            No Image
                          </Typography>
                        )
                      ) : col.render ? (
                        col.render(item)
                      ) : (
                        <Tooltip title={value || ""}>
                          <span>{value}</span>
                        </Tooltip>
                      )}
                    </TableCell>
                  );
                })}

                {actions && (
                  <TableCell align="right">
                    <IconButton
                      onClick={(event) => handleMenuClick(event, item)}
                      size="small"
                    >
                      <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                align="center"
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ py: 3 }}
                >
                  No data available
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Paper
      sx={{
        overflow: "hidden",
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: theme.shadows[1],
      }}
    >
      {/* Title (if provided) */}
      {title && (
        <Typography
          variant="h6"
          sx={{
            p: 2,
            pb: 0,
            fontWeight: 600,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          {title}
        </Typography>
      )}

      {/* Responsive filters */}
      {isMobile ? <MobileToolbar /> : <DesktopFilters />}

      {/* Mobile Filters Drawer */}
      <MobileFiltersDrawer />

      {/* Responsive Table */}
      <ResponsiveTable />

      {/* Table Footer with Pagination and Dense Switch */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          p: 2,
          gap: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TablePagination
          component="div"
          count={totalPages * rowsPerPage}
          page={page - 1}
          onPageChange={(event, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onPageChange(1);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ from, to, count }) =>
            isMobile ? `${from}-${to}` : `${from}-${to} of ${count}`
          }
          sx={{
            flex: 1,
            "& .MuiTablePagination-toolbar": {
              flexWrap: "wrap",
              gap: 1,
              minHeight: "auto",
              px: { xs: 1, sm: 2 },
            },
          }}
        />

        <FormControlLabel
          control={
            <Switch checked={dense} onChange={handleChangeDense} size="small" />
          }
          label="Dense view"
          sx={{
            mr: 0,
            "& .MuiFormControlLabel-label": {
              fontSize: "0.875rem",
            },
          }}
        />
      </Box>

      {/* Action Menu */}
      {actions && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              minWidth: 150,
              boxShadow: theme.shadows[3],
            },
          }}
        >
          {actions.map((action) => (
            <MenuItem
              key={action.label}
              onClick={() => {
                action.handler(selectedItem);
                handleMenuClose();
              }}
              sx={{ fontSize: "14px" }}
            >
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      )}

      {/* Floating action button for quick filters on mobile */}
      {isMobile && !mobileFiltersOpen && activeFiltersCount > 0 && (
        <Zoom in={true}>
          <Fab
            size="small"
            color="primary"
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              zIndex: 1000,
            }}
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Badge badgeContent={activeFiltersCount} color="error">
              <TuneIcon />
            </Badge>
          </Fab>
        </Zoom>
      )}
    </Paper>
  );
};

export default MDataTable;
