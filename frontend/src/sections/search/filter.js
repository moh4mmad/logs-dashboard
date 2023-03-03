import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const severity_levels = [
  {
    value: '',
    label: 'Select severity'
  },
  {
    value: 'info',
    label: 'Info'
  },
  {
    value: 'emergency',
    label: 'Emergency'
  },
  {
    value: 'critical',
    label: 'Critical'
  },
  {
    value: 'alert',
    label: 'Alert'
  },
  {
    value: 'error',
    label: 'Error'
  },
  {
    value: 'warning',
    label: 'Warning'
  },
  {
    value: 'notice',
    label: 'Notice'
  },

  {
    value: 'debug',
    label: 'Debug'
  },
  {
    value: 'trace',
    label: 'Trace'
  }
];

export const SearchFilter = ({setFilterValues, filter_values, setSearchApplied}) => {


  const handleChange = useCallback(
    (event) => {
      setFilterValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleStartDateChange = useCallback(
    (value) => {
      setFilterValues((prevState) => ({
        ...prevState,
        start_date: new Date(value).toISOString().slice(0, 10)
      }));
    },
    []
  );

  const handleEndDateChange = useCallback(
    (value) => {
      setFilterValues((prevState) => ({
        ...prevState,
        end_date: new Date(value).toISOString().slice(0, 10)
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setSearchApplied(true)
    },
    []
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          title="Filter Logs"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={3}
              >
                <DesktopDatePicker
                  fullWidth
                  label="Start Date"
                  name="start_date"
                  inputFormat="yyyy/MM/dd"
                  onChange={handleStartDateChange}
                  value={filter_values.start_date}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                xs={12}
                md={3}
              >
                <DesktopDatePicker
                  fullWidth
                  label="End Date"
                  name="end_date"
                  inputFormat="yyyy/MM/dd"
                  onChange={handleEndDateChange}
                  required
                  value={filter_values.end_date}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid
                xs={12}
                md={2}
              >
                <TextField
                  fullWidth
                  label="Select severity"
                  name="severity"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={filter_values.severity}
                >
                  {severity_levels.map((severity) => (
                    <option
                      key={severity.value}
                      value={severity.value}
                    >
                      {severity.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={3}
              >
                <TextField
                  fullWidth
                  label="Source"
                  name="source"
                  onChange={handleChange}
                  value={filter_values.source}
                />
              </Grid>
              <Grid
                xs={12}
                md={1}
              >
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                  type="submit"
                  variant="contained">
                    Search
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};
