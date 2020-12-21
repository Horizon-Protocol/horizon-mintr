import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './Card';

export default function RatiosCard({ loading, debtStatusData = {} }) {
  const { t } = useTranslation();

  console.log('debtStatusData', debtStatusData);

  const rows = useMemo(() => {
    const { currentCRatio, targetCRatio } = debtStatusData || {};
    console.log('rows', currentCRatio, targetCRatio);
    return [
      {
        name: t('dashboard.ratio.current'),
        value: `${currentCRatio ? Math.round(100 / currentCRatio) : 0}%`,
      },
      {
        name: t('dashboard.ratio.target'),
        value: `${targetCRatio ? Math.round(100 / targetCRatio) : 0}%`,
      },
      {
        name: t('dashboard.liquidation.title'),
        value: `${debtStatusData?.liquidationRatio || 0}%`,
      },
    ];
  }, [t, debtStatusData]);

  return <Card loading={loading} rows={rows} />;
}
