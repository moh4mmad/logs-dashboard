import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const LogsAggregate = (props) => {
  const { logs = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Aggregated log data" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Severity
                </TableCell>
                <TableCell>
                  Source
                </TableCell>
                <TableCell>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, index) => {
                return (
                  <TableRow
                    hover
                    key={index}
                  >
                    <TableCell>
                      {log.severity}
                    </TableCell>
                    <TableCell>
                      {log.source}
                    </TableCell>
                    <TableCell>
                      {log.count}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

LogsAggregate.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
