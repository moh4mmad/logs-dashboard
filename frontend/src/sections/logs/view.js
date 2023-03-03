import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  CardActions,
  Divider,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useRouter } from "next/navigation";
import API from "src/services/api";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import DeleteLog from "./delete";

const severity_levels = [
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

export const LogView = (props) => {
    const router = useRouter();
    const id = props.id;
    const [edit, setEdit] = useState(false);
    const [deleteLog, setDeleteLog] = useState(false);
    const [initialValues, setInitialValues] = useState({
        id: null,
        severity: 'info',
        source: '',
        message: '',
    });

    const fetchLog = async () => {
        try {
          const response = await API.get("log/" + id);
          setInitialValues(response);
        } catch (error) {
          toast.error("Failed to load log data", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
    };
    
    const formik = useFormik({
        initialValues: {
            submit: null,
            severity: initialValues.severity,
            source: initialValues.source,
            message: initialValues.message
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            severity: Yup.string().max(55).required("Severity is required"),
            source: Yup.string().max(55).required("Source is required"),
            message: Yup.string().max(255).required("Message is required"),
        }),
        
        onSubmit: async (values, helpers) => {
            try {
                const response = await API.update("log/"+ id, values);
                toast.success("Log updated successfully", {
                    position: toast.POSITION.TOP_CENTER,
                });
                router.push('/logs');
            } catch (err) {
                toast.error("Failed to add log", {
                    position: toast.POSITION.TOP_CENTER,
                });
                helpers.setSubmitting(false);
            }
        },
    });
    
    useEffect(() => {
        fetchLog()
    },[])
    
    const handleEdit = () => {
        setEdit(!edit);
    }   

    const handleDelete = () => {
      setDeleteLog(!deleteLog);
    }   

    return (
      <>
        <form
        noValidate
        onSubmit={formik.handleSubmit}
        >
          {edit ? (
            <Card>
                <CardHeader/>
                <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                    <Grid
                    container
                    spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={6}
                        >
                            <TextField
                            fullWidth
                            label="Select severity"
                            name="severity"
                            error={!!(formik.touched.severity && formik.errors.severity)}
                            helperText={formik.touched.severity && formik.errors.severity}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.severity}
                            select
                            SelectProps={{ native: true }}
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
                            md={6}
                        >
                            <TextField
                            fullWidth
                            label="Source"
                            name="source"
                            error={!!(formik.touched.source && formik.errors.source)}
                            helperText={formik.touched.source && formik.errors.source}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.source}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            md={12}
                        >
                            <TextField
                            fullWidth
                            label="Message"
                            name="message"
                            multiline
                            rows={2}
                            error={!!(formik.touched.message && formik.errors.message)}
                            helperText={formik.touched.message && formik.errors.message}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.message}
                            />
                        </Grid>
                    </Grid>
                </Box>
                </CardContent>
                <Divider />
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ mt: -1.5 }}>
                <Grid
                  container
                  spacing={6}
                  wrap="wrap"
                >
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        Severity
                      </Typography>
                      <Typography variant="subtitle1"
                        gutterBottom
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {initialValues.severity}
                      </Typography>
                      
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        Source
                      </Typography>
                      <Typography variant="subtitle1"
                        gutterBottom
                      >
                        {initialValues.source}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h6">
                        Message
                      </Typography>
                      <Typography variant="subtitle1"
                        gutterBottom
                      >
                        {initialValues.message}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
            </Card>
          )}
          <Card>
            <CardActions>
              <Button
                  variant="contained"
                  color="info"
                  onClick={() => router.push('/logs')}
              >
                  Cancel
              </Button>
              <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleEdit()}
              >
                  { edit ? 'View' : 'Edit' } Log
              </Button>
              <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting || !edit}
              >
                  Update
              </Button>
              <Button
                  variant="contained"
                  color="error"
                  disabled={edit}
                  onClick={() => handleDelete()}
              >
                  Delete
              </Button>
            </CardActions>
          </Card>
        </form>
        <DeleteLog
          id={id}
          open={deleteLog}
          handleClose={() => handleDelete()}
        />
      </>
    );
};