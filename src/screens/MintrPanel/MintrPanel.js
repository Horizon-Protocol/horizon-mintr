import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { setCurrentTab, getCurrentTab } from '../../ducks/ui';
import { getModalState } from '../../ducks/modal';

import { Home, Depot, Transactions, Escrow, LPRewards } from '../MintrTabs';
import { TabButton } from '../../components/Button';
import { DelegateModal } from '../../components/Modal';
import { MODAL_TYPES_TO_KEY } from '../../constants/modal';

import { getWalletDetails } from '../../ducks/wallet';
import { SUPPORTED_NETWORKS_MAP } from 'helpers/networkHelper';

const renderScreen = screen => {
	switch (screen) {
		case 'home':
		default:
			return <Home />;
		case 'depot':
			return <Depot />;
		case 'transactionsHistory':
			return <Transactions />;
		case 'escrow':
			return <Escrow />;
		case 'lpRewards':
			return <LPRewards />;
	}
};

const RESTRICTED_TABS = {
	[SUPPORTED_NETWORKS_MAP.GOERLI]: {
		depot: true,
		escrow: true,
		lpRewards: true,
		transactionsHistory: true,
	},
};

// const tabs = ['home', 'depot', 'transactionsHistory', 'escrow', 'lpRewards']
const tabs = ['home'];

const MainContainer = ({
	currentTab,
	modalState: { modalType, modalProps },
	setCurrentTab,
	walletDetails: { networkId },
}) => {
	const { t } = useTranslation();

	return (
		<MainContainerWrapper>
			<Overlay isVisible={modalType}></Overlay>
			{false && (
				<Header>
					{tabs.map(tab => {
						return (
							<TabButton
								key={tab}
								isSelected={tab === currentTab}
								onClick={() => setCurrentTab({ tab })}
								disabled={RESTRICTED_TABS[networkId] && RESTRICTED_TABS[networkId][tab]}
							>
								{/* i18next-extract-disable-next-line */}
								{t(`mainNavigation.tabs.${tab}`)}
							</TabButton>
						);
					})}
				</Header>
			)}
			{renderScreen(currentTab)}
			{modalType === MODAL_TYPES_TO_KEY.DELEGATE ? <DelegateModal {...modalProps} /> : null}
		</MainContainerWrapper>
	);
};

const MainContainerWrapper = styled('div')`
	width: 100%;
	background-color: ${props => props.theme.colorStyles.background};
	position: relative;
`;

const Header = styled('div')`
	display: flex;
	justify-content: space-between;
	height: 80px;
	background-color: ${props => props.theme.colorStyles.menu};
`;

const Overlay = styled.div`
	visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgb(0, 0, 0, 0.7);
	z-index: 1000;
`;

const mapStateToProps = state => ({
	currentTab: getCurrentTab(state),
	modalState: getModalState(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	setCurrentTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
