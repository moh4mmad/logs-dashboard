import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  CardActions,
  Divider,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useRouter } from "next/navigation";
import API from "src/services/api";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";

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

export const CreateNewLog = () => {

    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            submit: null,
            severity: 'info',
            source: '',
            message: '',
        },
        validationSchema: Yup.object({
            severity: Yup.string().max(55).required("Severity is required"),
            source: Yup.string().max(55).required("Source is required"),
            message: Yup.string().max(255).required("Message is required"),
        }),
        
        onSubmit: async (values, helpers) => {
            try {
                const response = await API.post("log", values);
                toast.success("Log created successfully", {
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

    return (
        <form
        noValidate
        onSubmit={formik.handleSubmit}
        >
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
                    type="submit"
                    disabled={formik.isSubmitting}
                >
                    Save
                </Button>

                </CardActions>
            </Card>
        </form>
    );
};
