import { useMemo, useState } from "react";
import { Paper, Table, TableHead, TableBody, TableCell, TableSortLabel, TableRow, Menu, MenuItem, IconButton, Skeleton, Button, Typography, Box, TablePagination, Tooltip, FormControlLabel, Switch, Chip, FormControl, TextField, Select, InputAdornment, alpha } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from '@mui/icons-material/Search'
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const DataTable = ({
  data, loading, columns, actions, FileUrl,
  page, onPageChange, filters, sort, search, title,
  totalPages, rowsPerPage, setRowsPerPage, getLink, exportToExcel = false }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dense, setDense] = useState(true);
  const [orderBy, setOrderBy] = useState('');
  const [orderDirection, setOrderDirection] = useState('asc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
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

    // Prepare flat data for Excel
    const excelData = data.map((item) => {
      const row = {};
      columns.forEach((col) => {
        // const value = item[col.field];
        const value = getNestedValue(item, col.field)
        row[col.label] = col.isDate && dayjs(value).isValid()
          ? dayjs(value).format("DD/MM/YYYY")
          : value;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `data-table-export-${Date.now()}.xlsx`);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const sortedData = useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, orderBy);
      const bValue = getNestedValue(b, orderBy);

      if (aValue < bValue) return orderDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return orderDirection === 'asc' ? 1 : -1;
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

  return (
    <Paper sx={{ overflowX: 'auto' }}>

      <Box sx={{
        display: "flex",
        justifyContent: title ? "space-between" : "flex-end",
        alignItems: "center",
        p: 2,
        gap: 3,
      }}>

        {/* Search */}
        {search && (
          <TextField
            label={search.placeholder}
            variant="outlined"
            onChange={search.onChange}
            fullWidth
            sx={{
              flex: 1,
              backgroundColor: (theme) => alpha(theme.palette.grey[50], 0.9),
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                height: '40px', // Match button height
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#bbb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A00E0',
                  borderWidth: 2,
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
          />
        )}

        {/* Filters */}
        {filters && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              label="Filter"
              value={filters.value}
              onChange={(e) => filters.onChange(e.target.value)}
            >
              {filters.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Custom Date Range */}
        {filters?.customDateRange && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              type="date"
              label="From"
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              value={filters.customDateRange.fromDate || ""}
              onChange={(e) => filters.customDateRange?.onFromDateChange(e.target.value)}
            />
            <TextField
              type="date"
              label="To"
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              value={filters.customDateRange.toDate || ""}
              onChange={(e) => filters.customDateRange?.onToDateChange(e.target.value)}
            />
          </Box>
        )}

        {/* Sort */}
        {sort && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              label="Sort By"
              value={sort.value}
              onChange={(e) => sort.onChange(e.target.value)}
            >
              {sort.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {exportToExcel && data.length > 0 && (
          <Button variant="outlined" color="success" onClick={handleDownloadExcel}>
            Export to Excel
          </Button>
        )}
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#E2E2E2' }}>
              {columns.map((column, index) => (
                <TableCell key={index} sx={{ fontWeight: 600 }}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? orderDirection : 'asc'}
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
                <TableCell align="right" sx={{ fontWeight: 600 }}>
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
                    '&:hover': { backgroundColor: getLink ? '#f0f8ff' : '#f9f9f9' },
                    cursor: getLink ? 'pointer' : 'default'
                  }}
                >

                  {columns.map((col, i) => {
                    const value = getNestedValue(item, col.field);

                    return (
                      <TableCell key={col.field || i} onClick={() => {
                        if (getLink) navigate(getLink(item));
                      }}>
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
                          dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : "Invalid Date"
                        ) : col.type === "number" ? (
                          <span style={{ textAlign: "right", display: "inline-block", minWidth: 60 }}>
                            {Number(value).toLocaleString()}
                          </span>
                        ) : col.type === "image" ? (
                          value && FileUrl ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 50,
                                height: 50,
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #ddd",
                                backgroundColor: "#fafafa",
                              }}
                            >
                              <img
                                src={value.startsWith("http") ? value : `${FileUrl}/${value}`}
                                alt="Product"
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
                            <span
                              style={{
                                display: "inline-block",
                                maxWidth: 150,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "#333",
                                fontSize: "0.95rem",
                              }}
                            >
                              {value}
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    );
                  })}


                  {actions && (
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuClick(event, item)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Typography variant="body1" color="textSecondary" sx={{ py: 3 }}>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={totalPages * rowsPerPage}
        page={page - 1}
        onPageChange={(event, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          onPageChange(1); // reset to page 1 when limit changes
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />


      {actions && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Paper>
  );
};

export default DataTable;