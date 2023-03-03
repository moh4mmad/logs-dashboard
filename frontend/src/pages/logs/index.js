import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LogsTable } from 'src/sections/logs/logs-table';
import API from "src/services/api";
import { toast } from "react-toastify";
import { SearchFilter } from "src/sections/search/filter";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from "next/navigation";

const Logs = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [searchApplied, setSearchApplied] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [orderBy, setOrderBy] = useState('id');
  const [orderDirection, setOrderDirection] = useState('desc');

  const [filter_values, setFilterValues] = useState({
    start_date: null,
    end_date: null,
    severity: '',
    source: ''
  });

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  }

  const fetchLogs = async () => {
    setBackdrop(true);
    try {
      const params = new URLSearchParams();
      params.append("page_size", rowsPerPage)
      Object.entries(filter_values).map((key, index) => {
        if (key[1]) params.append(key[0], key[1])
      })
      if(page) params.append("page", page+1)
      if (orderBy) {
        params.append("order_by", orderBy)
        params.append("order_direction", orderDirection)
      }
      const response = await API.get("log?" + params.toString());
      setLogs(response.results);
      setTotalLogs(response.count);
      setBackdrop(false);
    } catch (error) {
      toast.error("Failed to load logs data", {
        position: toast.POSITION.TOP_CENTER,
      });
      setBackdrop(false);
    }
  };

  const handleDownloadCsv = async () => {
    setBackdrop(true);
    try {
      const response = await API.download("log-export");
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setBackdrop(false);
    } catch (error) {
      toast.error("Failed to export logs", {
        position: toast.POSITION.TOP_CENTER,
      });
      setBackdrop(false);
    }
  }

  useEffect(() => {
    fetchLogs();
    if(searchApplied) {
      setSearchApplied(false);
    }
  }, [page, rowsPerPage, orderBy, orderDirection, searchApplied]);

  return (
    <>
      <Head>
        <title>
          Logs
        </title>
      </Head>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Logs
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="info"
                    variant="contained"
                    endIcon={(
                      <SvgIcon fontSize="small">
                        { showFilter ? (
                        <ArrowUpOnSquareIcon />
                        ) : (
                        <ArrowDownOnSquareIcon />
                        )}
                      </SvgIcon>
                    )}
                    onClick={handleShowFilter}>
                      Filter
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleDownloadCsv}
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  onClick={() => router.push('/logs/create')}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            { showFilter && (
              <SearchFilter
                setFilterValues={setFilterValues}
                filter_values={filter_values}
                setSearchApplied={setSearchApplied}
                searchApplied={searchApplied}
              />)
            }
            <LogsTable
              count={totalLogs}
              items={logs}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              orderDirection={orderDirection}
              setOrderDirection={setOrderDirection}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Logs.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Logs;