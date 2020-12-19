import { Button } from '@material-ui/core';

export default function BscScanBtn({ networkName, transactionHash, children }) {
  return (
    <Button
      variant="outlined"
      href={`https://${
        networkName === 'mainnet' ? '' : networkName + '.'
      }bscscan.com/tx/${transactionHash}`}
      target="_blank"
    >
      {children}
    </Button>
  );
}
