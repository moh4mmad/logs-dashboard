import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  SvgIcon,
  Button,
  TableSortLabel
} from '@mui/material';
import { useRouter } from "next/navigation";
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import { Scrollbar } from 'src/components/scrollbar';
import { formatDate } from 'src/utils/formatDate';

const headCells = [
  {
    id: 'id',
    label: '#',
    order: true
  },
  {
    id: 'severity',
    label: 'Severity',
    order: true
  },
  {
    id: 'source',
    label: 'Source',
    order: true
  },
  {
    id: 'message',
    label: 'Message',
    order: false
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    order: true
  },
  {
    id: 'view',
    label: 'View',
    order: false
  }
];

export const LogsTable = (props) => {
  const router = useRouter();
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    orderDirection,
    setOrderDirection,
    orderBy,
    setOrderBy
  } = props;

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderBy(property);
    setOrderDirection(isAsc ? 'desc' : 'asc');
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}>
                    {headCell.order ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? orderDirection : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>) : headCell.label }
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((log) => {
                const createdAt = formatDate(log.timestamp)
                return (
                  <TableRow
                    hover
                    key={log.id}
                  >
                    <TableCell>
                      {log.id}
                    </TableCell>
                    <TableCell>
                      {log.severity}
                    </TableCell>
                    <TableCell>
                      {log.source}
                    </TableCell>
                    <TableCell>
                      { log.message.slice(0, 30)}
                    </TableCell>
                    <TableCell>
                      {createdAt}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => router.push(`/logs/${log.id}`)}
                      >
                        <SvgIcon fontSize="small">
                          <EyeIcon />
                        </SvgIcon>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Card>
  );
};

LogsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number
};
