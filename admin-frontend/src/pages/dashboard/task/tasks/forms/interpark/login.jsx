import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import { useServerData } from 'src/hooks/use-data.js';

import { getAllProxies } from 'src/service/proxy.js';
import { getAllInterparkAccountGroup } from 'src/service/interpark-account-group.js';

import VSelect from 'src/components/vcat/VSelect.jsx';
import VCheckbox from 'src/components/vcat/VCheckbox.jsx';
import VFormGroup from 'src/components/vcat/VFormGroup.jsx';
import VTextField from 'src/components/vcat/VTextField.jsx';
import VAutoComplete from 'src/components/vcat/VAutoComplete.jsx';

const InterparkLoginTaskForm = ({ data }) => {
  const proxies = useServerData(getAllProxies, []);
  const accountGroups = useServerData(getAllInterparkAccountGroup, []);

  const form = useFormContext();

  return (
    <Box component="form" sx={{ p: 2, width: '100%', padding: 0 }}>
      <VFormGroup title="Settings">
        <Grid container spacing={2}>
          <Grid size={6}>
            <VAutoComplete
              name="accountGroupId"
              label="Account Group"
              required
              options={accountGroups.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
            />
          </Grid>
          <Grid size={6}>
            <VTextField label="Concurrency" name="concurrency" required />
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
          <Grid size={6}>
            <VCheckbox name="forceLoginAll" label="Force Login All" />
          </Grid>
        </Grid>
      </VFormGroup>
    </Box>
  );
};

export default InterparkLoginTaskForm;
