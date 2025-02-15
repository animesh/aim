import React, { memo } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import ConfirmModal from 'components/ConfirmModal/ConfirmModal';
import { ActionCard, Icon } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import runDetailAppModel from 'services/models/runs/runDetailAppModel';
import * as analytics from 'services/analytics';

import { IRunDetailSettingsTabProps } from './types';

function RunDetailSettingsTab({
  runHash,
  isArchived,
}: IRunDetailSettingsTabProps): React.FunctionComponentElement<React.ReactNode> {
  const history = useHistory();
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);

  function onRunArchive() {
    analytics.trackEvent(
      ANALYTICS_EVENT_KEYS.runDetails.tabs.settings.archiveRun,
    );
    runDetailAppModel.archiveRun(runHash, !isArchived);
  }

  function onRunDelete() {
    analytics.trackEvent(
      ANALYTICS_EVENT_KEYS.runDetails.tabs.settings.deleteRun,
    );
    runDetailAppModel.deleteRun(runHash, () => {
      history.push('/runs');
    });
  }

  function handleDeleteModalOpen() {
    setOpenDeleteModal(true);
  }

  function handleDeleteModalClose() {
    setOpenDeleteModal(false);
  }

  React.useEffect(() => {
    analytics.pageView(ANALYTICS_EVENT_KEYS.runDetails.tabs.settings.tabView);
  }, []);

  return (
    <ErrorBoundary>
      <div className='RunDetailSettingsTab'>
        <div className='RunDetailSettingsTab__actionCardsCnt'>
          <ActionCard
            title={isArchived ? 'Unarchive Run' : 'Archive Run'}
            description={
              isArchived
                ? 'Unarchive runs will appear in search both on Dashboard and Explore.'
                : 'Archived runs will not appear in search both on Dashboard and Explore.'
            }
            btnTooltip={isArchived ? 'Unarchive' : 'Archive'}
            btnText={isArchived ? 'Unarchive' : 'Archive'}
            onAction={onRunArchive}
            btnProps={{
              variant: 'outlined',
              className: classNames({
                RunDetailSettingsTab__actionCardsCnt__btn__archive: !isArchived,
                RunDetailSettingsTab__actionCardsCnt__btn__unarchive:
                  isArchived,
              }),
            }}
          />

          <ActionCard
            title='Delete Run'
            description='Once you delete a run, there is no going back. Please be certain.'
            btnTooltip='Delete Run'
            btnText='Delete'
            onAction={handleDeleteModalOpen}
            btnProps={{
              variant: 'contained',
              className: 'RunDetailSettingsTab__actionCardsCnt__btn__delete',
            }}
          />
        </div>

        <ConfirmModal
          open={openDeleteModal}
          onCancel={handleDeleteModalClose}
          onSubmit={onRunDelete}
          text='Are you sure you want to delete this run?'
          icon={<Icon name='delete' />}
          title='Are you sure?'
          statusType='error'
          confirmBtnText='Delete'
        />
      </div>
    </ErrorBoundary>
  );
}

export default memo(RunDetailSettingsTab);
