import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { Box, Container, SvgIcon, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { LogsAggregate } from "src/sections/dashboard/logs-aggregate";
import { LogsChart } from "src/sections/dashboard/logs-chart";
import { LogsHistoryGram } from "src/sections/dashboard/logs-historygram";
import API from "../services/api";
import { toast } from "react-toastify";
import { SearchFilter } from "src/sections/search/filter";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const Page = () => {
  const [logAggregates, setLogAggregates] = useState([]);
  const [logAggregateChart, setLogAggregateChart] = useState({
    labels: [],
    count: [],
  });
  const [searchApplied, setSearchApplied] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [filter_values, setFilterValues] = useState({
    start_date: null,
    end_date: null,
    severity: '',
    source: ''
  });

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  }

  const getLogAggregates = async () => {
    setBackdrop(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filter_values).map((key, index) => {
        if (key[1]) params.append(key[0], key[1])
      })
      const response = await API.get("log-aggregate?" + params.toString());
      setLogAggregates(response);
      setBackdrop(false);
    } catch (error) {
      toast.error("Failed to load log aggregates data", {
        position: toast.POSITION.TOP_CENTER,
      });
      setBackdrop(false);
    }
  };

  const getLogAggregateChartData = async () => {
    setBackdrop(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filter_values).map((key, index) => {
        if (key[1]) params.append(key[0], key[1])
      })
      if(filter_values.source) {
        params.append('label', 'source');
      } else if(filter_values.source && filter_values.severity) {
        params.append('label', 'severity')
      } else {
        params.append('label', 'severity');
      }
      const response = await API.get("log-aggregate-chart?"+ params.toString());
      setLogAggregateChart(response);
      setBackdrop(false);
    } catch (error) {
      toast.error("Failed to load log aggregates chart data", {
        position: toast.POSITION.TOP_CENTER,
      });
      setBackdrop(false);
    }
  };

  useEffect(() => {
    getLogAggregates();
    getLogAggregateChartData();
    if(searchApplied) {
      setSearchApplied(false);
    }
  }, [searchApplied]);

  return (
    <>
      <Head>
        <title> Dashboard </title>{" "}
      </Head>{" "}
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
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container
spacing={3}>
            <Grid xs={12}
md={12}
lg={12}>
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
            </Grid>
            <Grid xs={12}
md={12}
lg={12}
sx={{ display: showFilter ? 'block' : 'none' }}>
              <SearchFilter
                setFilterValues={setFilterValues}
                filter_values={filter_values}
                setSearchApplied={setSearchApplied}
                searchApplied={searchApplied}
              />
            </Grid>
            
            <Grid xs={12}
lg={6}>
              <LogsHistoryGram
                chartSeries={[
                  {
                    name: "Data",
                    data: logAggregateChart.count,
                  },
                ]}
                categories={logAggregateChart.labels}
                sx={{ height: "100%" }}
              />{" "}
            </Grid>{" "}
            <Grid xs={12}
md={6}
lg={6}>
              <LogsChart
                chartSeries={logAggregateChart.count}
                labels={logAggregateChart.labels}
                sx={{ height: "100%" }}
              />{" "}
            
            </Grid>{" "}
            <Grid
              xs={12}
              md={12}
              lg={12}
            >
              <LogsAggregate
                logs={logAggregates}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>{" "}
        </Container>{" "}
      </Box>{" "}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout> {page} </DashboardLayout>;

export default Page;
