import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import { useServerData } from 'src/hooks/use-data.js';

import { getAllProxies } from 'src/service/proxy.js';
import { getAllPerforms } from 'src/service/interpark-perform.js';
import { getQueueRoutersByType } from 'src/service/queue-router.js';
import { getAllInterparkSeatRotatePools } from 'src/service/interpark-seat-rotate-pool.js';

import VSelect from 'src/components/vcat/VSelect.jsx';
import EditTable from 'src/components/vcat/VEditTable.jsx';
import VTextField from 'src/components/vcat/VTextField.jsx';
import VFormGroup from 'src/components/vcat/VFormGroup.jsx';
import VAutoComplete from 'src/components/vcat/VAutoComplete.jsx';

const fetchRouters = async () => await getQueueRoutersByType('INTERPARK');

const InterparkBookingTaskForm = ({ data }) => {
  const proxies = useServerData(getAllProxies, []);
  const performs = useServerData(getAllPerforms, []);
  const rotatePools = useServerData(getAllInterparkSeatRotatePools, []);
  const routers = useServerData(fetchRouters, []);
  const [currentPerformId, setCurrentPerformId] = useState();

  const roundsTableRef = useRef();

  const currentPerform = performs.find((it) => it.id === currentPerformId);

  const bookingRangesColumns = [
    {
      key: 'round',
      label: 'Round',
      dataIndex: 'round',
      width: 200,
      type: 'select',
      options: currentPerform?.rounds?.map((r) => ({
        value: r.sequence,
        label: r.date,
      })) || [],
    },
    {
      key: 'blocks',
      label: 'Blocks',
      dataIndex: 'blocks',
      type: 'multi-select',
      width: 400,
      options: currentPerform?.blocks?.map((b) => ({
        value: b.code,
        label: b.name,
      })) || [],
    },
    {
      key: 'round',
      label: '',
    },
  ];

  return (
    <Box component="form" sx={{ p: 2, width: '100%', padding: 0 }}>
      <VFormGroup title="Base Settings">
        <Grid container spacing={2}>
          <Grid size={6}>
            <VAutoComplete
              name="performId"
              label="Perform"
              required
              options={performs.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              onChange={(value) => {
                setCurrentPerformId(value);
              }}
            />
          </Grid>
          <Grid size={6}>
            <VSelect
              name="proxyId"
              label="Proxy"
              required
              options={proxies.map((it) => ({
                value: it.id,
                label: it.name,
              }))}
            />
          </Grid>
          <Grid size={6}>
            <VSelect
              name="captchaHandler"
              label="Captcha Handler"
              options={[
                {
                  value: 'CAP_SOLVER',
                  label: 'CapSolver',
                },
              ]}
            />
          </Grid>
        </Grid>
      </VFormGroup>
      <VFormGroup title="Queue Settings">
        <Grid container spacing={2}>
          <Grid size={6}>
            <VTextField label="Concurrency" name="concurrency" required />
          </Grid>
          <Grid size={6}>
            <VTextField label="Request Interval(ms)" name="requestInterval" required />
          </Grid>
        </Grid>
      </VFormGroup>
      <VFormGroup title="Booking settings">
        <Grid container spacing={2}>
          <Grid size={6}>
            <VTextField label="Concurrency" name="concurrency" required />
          </Grid>
          <Grid size={6}>
            <VTextField label="Request Interval(ms)" name="requestInterval" required />
          </Grid>
          <Grid size={6}>
            <VAutoComplete
              name="rotatePoolId"
              label="Seat Rotate Pool"
              options={rotatePools.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
            />
          </Grid>
        </Grid>
      </VFormGroup>
      <VFormGroup title="Booking Ranges">
        <EditTable ref={roundsTableRef} columns={bookingRangesColumns} initialData={data?.rounds} />
      </VFormGroup>
    </Box>
  );
};

export default InterparkBookingTaskForm;
