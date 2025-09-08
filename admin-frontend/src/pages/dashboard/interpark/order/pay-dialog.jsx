import { useState } from 'react';

import Alert from '@mui/material/Alert';

import { useOnceData } from 'src/hooks/use-data.js';

import { finishPay, getPayInfo, getInterparkOrder } from 'src/service/interpark-order.js';

import VDialog from 'src/components/vcat/VDialog.jsx';
import VFormGroup from 'src/components/vcat/VFormGroup.jsx';
import VDescriptions from 'src/components/vcat/VDescriptions.jsx';

const PayDialog = ({ orderId, onCancel, onFinish }) => {

  const [errorMessage, setErrorMessage] = useState();

  const { data: order } = useOnceData({
    key: ['order'],
    query: async () => await getInterparkOrder(orderId),
  });

  const { data: wechatPayInfo, isLoading: isWechatPayInfoLoading } = useOnceData({
    key: 'wechatPayInfo',
    query: async () => await getPayInfo(orderId),
  });

  const handlePay = async () => {
    setErrorMessage(null);
    const response = await finishPay(orderId)
    if (response.status !== 'SUCCESS') {
      setErrorMessage(response.message);
    } else {
      onFinish();
    }
  };

  return (
    <VDialog title="Pay Order" okText="Finish" open onCancel={onCancel} onOk={handlePay} maxWidth={1300}>
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <VDescriptions
        items={[
          {
            key: 'id',
            label: 'ID',
            children: order?.id,
          },
          {
            key: 'productName',
            label: 'Product Name',
            children: order?.productName,
          },
          {
            key: 'email',
            label: 'Email',
            children: order?.email,
          },
          {
            key: 'playDate',
            label: 'Date',
            children: order?.playDate,
          },
          {
            key: 'blockCode',
            label: 'Block Code',
            children: order?.blockCode,
          },
          {
            key: 'seatGradeName',
            label: 'Seat Grade',
            children: order?.seatGradeName,
          },
          {
            key: 'floor',
            label: 'Floor',
            children: order?.floor,
          },
          {
            key: 'rowNo',
            label: 'Row',
            children: order?.rowNo,
          },
          {
            key: 'seatNo',
            label: 'Seat No',
            children: order?.seatNo,
          },
        ]}
      />
      <VFormGroup title="Wechat Pay">
        <div>
          {
            isWechatPayInfoLoading ? (
              'QRCode is loading...'
            ) : (
              <img src={wechatPayInfo?.wechatQrCode}/>
            )
          }
        </div>
      </VFormGroup>
    </VDialog>
  );
};

export default PayDialog;
