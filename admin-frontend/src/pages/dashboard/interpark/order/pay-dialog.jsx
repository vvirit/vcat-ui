
import { useQuery } from '@tanstack/react-query';

import { useOnceData } from 'src/hooks/use-data.js';

import { getPayInfo, getInterparkOrder } from 'src/service/interpark-order.js';

import VDialog from 'src/components/vcat/VDialog.jsx';
import VFormGroup from 'src/components/vcat/VFormGroup.jsx';
import VDescriptions from 'src/components/vcat/VDescriptions.jsx';

const PayDialog = ({ orderId, onCancel }) => {

  const { data: order } = useOnceData({
    key: ['order'],
    query: async () => await getInterparkOrder(orderId),
  });

  const { data: wechatPayInfo, isLoading: isWechatPayInfoLoading } = useOnceData({
    key: 'wechatPayInfo',
    query: async () => await getPayInfo(orderId),
  });

  return (
    <VDialog title="Pay Order" okText="Finish" open onCancel={onCancel}>
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
