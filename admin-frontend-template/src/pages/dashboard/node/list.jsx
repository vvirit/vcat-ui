import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard/index.js';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const NodeList = () => {
  let a = 1;
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Node', href: paths.dashboard.node.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Table size="medium" sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
                <TableCell align="right">123</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </DashboardContent>
    </>
  );
};

export default NodeList;
