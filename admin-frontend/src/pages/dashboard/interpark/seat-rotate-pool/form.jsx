import {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {DialogActions, DialogContent, DialogTitle, Grid} from '@mui/material';

import {getAllPerforms} from 'src/service/interpark-perform.js';

import TabPanel from 'src/components/tab-panel/index.jsx';
import EditTable from 'src/components/edit-table/index.jsx';
import Autocomplete from "@mui/material/Autocomplete";
import {
  addInterparkSeatRotatePool,
  updateInterparkSeatRotatePool
} from "src/service/interpark-seat-rotate-pool.js";

export default function CreateForm({open, onCancel, onSuccess, data}) {

  const [errorMessage, setErrorMessage] = useState();
  const itemsTableRef = useRef();
  const [saving, setSaving] = useState(false);
  const [performs, setPerforms] = useState([]);
  const [currentPerformId, setCurrentPerformId] = useState(null);


  useEffect(() => {
    (async () => {
      const allPerforms = await getAllPerforms();
      setPerforms(allPerforms);
      if (data) {
        setCurrentPerformId(data.performId);
        console.log(data.performId);
      }
    })();
  }, [])

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    trigger,
  } = useForm({defaultValues: data});

  const currentPerform = currentPerformId ? performs.find(it => it.id === currentPerformId) : null;

  const seatsColumns = [
    {
      key: 'roundId',
      label: 'Round',
      dataIndex: 'roundId',
      width: 210,
      type: 'autocomplete',
      options: currentPerform?.rounds?.map(r => (
        {
          id: r.id,
          label: `${r.date}-${r.time}`,
        }
      )) || [],
    },
    {
      key: 'blockId',
      label: 'Block',
      dataIndex: 'blockId',
      width: 130,
      type: 'autocomplete',
      options: currentPerform?.blocks?.map(r => (
        {
          id: r.id,
          label: r.name,
        }
      ) || []),
    },
    {
      key: 'seatGrade',
      label: 'Seat grade',
      dataIndex: 'seatGrade',
      width: 110,
    },
    {
      key: 'seatGradeName',
      label: 'Seat grade name',
      dataIndex: 'seatGradeName',
      width: 150,
    },
    {
      key: 'floor',
      label: 'Floor',
      dataIndex: 'floor',
      width: 120,
    },
    {
      key: 'rowNo',
      label: 'Row no',
      dataIndex: 'rowNo',
      width: 120,
    },
    {
      key: 'seatNo',
      label: 'Seat no',
      dataIndex: 'seatNo',
    },
  ];


  const onSubmit = async (formData) => {
    const valid = await trigger();
    if (!valid) return;
    let payload = {
      ...formData,
      items: itemsTableRef.current?.getData() || [],
    };
    try {
      setSaving(true);
      if (data) {
        payload.id = data.id;
        await updateInterparkSeatRotatePool(payload);
      } else {
        await addInterparkSeatRotatePool(payload);
      }
      onSuccess();
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      slotProps={{
        paper: {
          sx: {maxWidth: 1200},
        },
      }}
    >
      <Box
        component="form"
        sx={{p: 2, width: '100%', padding: 0}}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>{data ? 'Edit seat rotate pool' : 'New seat rotate pool'}</DialogTitle>
        <DialogContent sx={{overflow: 'visible', px: 3}}>
          {!!errorMessage && (
            <Alert severity="error" sx={{mb: 3}}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Name"
                {...register('name', {required: 'Name is required'})}
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="performId"
                control={control}
                rules={{required: "Perform is required"}}
                render={({field, fieldState}) => (
                  <Autocomplete
                    options={performs.map(p => ({
                      id: p.id,
                      label: p.name,
                    }))}
                    size="small"
                    onChange={(_, v) => {
                      field.onChange(v?.id ?? null);
                      setCurrentPerformId(v?.id ?? null);
                    }}
                    value={(performs.map(p => ({
                      id: p.id,
                      label: p.name,
                    })) || []).find(o => o.id === currentPerformId) || null}
                    getOptionLabel={(o) => o.label}
                    isOptionEqualToValue={(a, b) => a.id === b.id}  // 避免比较失败
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Perform"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
          <TabPanel
            items={[
              {
                key: 'seats',
                label: 'Seats',
                children: (
                  <EditTable
                    ref={itemsTableRef}
                    columns={seatsColumns}
                    initialData={data?.items}
                  />
                ),
              },
            ]}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={saving}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
