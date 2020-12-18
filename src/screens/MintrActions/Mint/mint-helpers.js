import { formatCurrency } from '../../../helpers/formatters';
import { toNumber, isFinite, isNil } from 'lodash';

export function getStakingAmount({ issuanceRatio, mintAmount, hznPrice }) {
  if (!mintAmount || !issuanceRatio || !hznPrice) return '0';
  return formatCurrency(mintAmount / issuanceRatio / hznPrice);
}

export function estimateCRatio({ hznPrice, debtBalance, hznBalance, mintAmount }) {
  if (isNil(hznPrice) || isNil(debtBalance) || isNil(hznBalance)) {
    return 0;
  }

  const parsedMintAmount = toNumber(mintAmount);
  const mintAmountNumber = isFinite(parsedMintAmount) ? parsedMintAmount : 0;
  const hznValue = hznBalance * hznPrice;
  return Math.round((hznValue / (debtBalance + mintAmountNumber)) * 100);
}
