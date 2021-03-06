/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useValues, useActions } from 'kea';

import { EuiSpacer } from '@elastic/eui';

import { FlashMessages } from '../../../shared/flash_messages';
import { KibanaLogic } from '../../../shared/kibana';
import { Loading } from '../../../shared/loading';

import { LogRetentionCallout, LogRetentionOptions } from '../log_retention';

import { AnalyticsHeader, AnalyticsUnavailable } from './components';

import { AnalyticsLogic } from './';

interface Props {
  title: string;
  isQueryView?: boolean;
  isAnalyticsView?: boolean;
}
export const AnalyticsLayout: React.FC<Props> = ({
  title,
  isQueryView,
  isAnalyticsView,
  children,
}) => {
  const { history } = useValues(KibanaLogic);
  const { query } = useParams() as { query: string };
  const { dataLoading, analyticsUnavailable } = useValues(AnalyticsLogic);
  const { loadAnalyticsData, loadQueryData } = useActions(AnalyticsLogic);

  useEffect(() => {
    if (isQueryView) loadQueryData(query);
    if (isAnalyticsView) loadAnalyticsData();
  }, [history.location.search]);

  if (dataLoading) return <Loading />;
  if (analyticsUnavailable) return <AnalyticsUnavailable />;

  return (
    <>
      <AnalyticsHeader title={title} />
      <FlashMessages />
      <LogRetentionCallout type={LogRetentionOptions.Analytics} />
      {children}
      <EuiSpacer />
    </>
  );
};
