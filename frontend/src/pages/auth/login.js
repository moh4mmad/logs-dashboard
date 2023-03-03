import { useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      submit: null,
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(55).required("Email is required"),
      password: Yup.string().max(55).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.email, values.password);
        router.push("/");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/");
    }
  });

  return (
    <>
      <Head>
        <title> Login </title>{" "}
      </Head>{" "}
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1}
sx={{ mb: 3 }}>
              <Typography variant="h4"> Login </Typography>{" "}
              <Typography color="text.secondary"
variant="body2">
                Dont have an account ?{" "}
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register now{" "}
                </Link>{" "}
              </Typography>{" "}
            </Stack>{" "}
            <form noValidate
onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                />{" "}
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                />{" "}
              </Stack>{" "}
              {formik.errors.submit && (
                <Typography color="error"
sx={{ mt: 3 }}
variant="body2">
                  {" "}
                  {formik.errors.submit}{" "}
                </Typography>
              )}{" "}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                Login{" "}
              </Button>{" "}
            </form>{" "}
          </div>{" "}
        </Box>{" "}
      </Box>{" "}
    </>
  );
};

Page.getLayout = (page) => <AuthLayout> {page} </AuthLayout>;

export default Page;
