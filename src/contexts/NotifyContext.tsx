import React, { createContext, useState, useEffect, useContext } from 'react';
import Notify from 'bnc-notify';
import { BLOCKNATIVE_KEY } from 'helpers/networkHelper';

interface INotifyProvider {
  children: any;
  currentWallet: any;
  networkId: number;
}

export const NotifyContext = createContext({
  notify: null,
});

export const NotifyProvider: React.FC<INotifyProvider> = ({
  children,
  currentWallet,
  networkId,
}) => {
  const [notify, setNotify] = useState<any>(null);

  useEffect(() => {
    if (currentWallet) {
      setNotify(
        Notify({
          dappId: BLOCKNATIVE_KEY,
          networkId: networkId,
          darkMode: true,
        })
      );
    }
  }, [currentWallet, networkId]);
  return (
    <NotifyContext.Provider
      value={{
        notify,
      }}
    >
      {children}
    </NotifyContext.Provider>
  );
};

export const useNotifyContext = () => useContext(NotifyContext);
