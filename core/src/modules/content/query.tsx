import { AsunaDataTable, AsunaDataView, EasyForm, FormFieldType } from '@asuna-admin/components';
import { extractModelNameFromPane, resolveModelInPane, useAsunaModels } from '@asuna-admin/helpers';
import { RootState } from '@asuna-admin/store';
import { Col, Divider, message, PageHeader, Row } from 'antd';
import 'highlight.js/styles/default.css';
import { AppContext } from '@asuna-admin/core';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Highlight from 'react-highlight';
import { connect } from 'react-redux';
import * as util from 'util';
import * as fp from 'lodash/fp';
import { ModulesLoaderProps } from '..';
import * as _ from 'lodash';

export type QueryFieldsColumnProps<EntitySchema> = (keyof EntitySchema)[];

const ContentSearch: React.FC<ModulesLoaderProps & { rootState: RootState }> = props => {
  const {
    rootState: { content },
    basis: { pane },
  } = props;
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [viewRecord, setViewRecord] = useState();

  const { modelName, extraName } = extractModelNameFromPane(props.basis.pane);
  const { relations } = useAsunaModels(modelName, { extraName });
  const { modelConfig, primaryKey, columnOpts } = resolveModelInPane(modelName, extraName);

  useEffect(() => {
    setIsOnline(true);
    console.log('set online', true);

    return () => {
      setIsOnline(false);
      console.log('set online', false);
    };
  }, [props.module]);

  const fields = _.fromPairs(
    _.map(columnOpts?.columnProps?.queryFields || [primaryKey], value => {
      return [value, { name: value as string, type: FormFieldType.string }];
    }),
  );
  /*{
    [primaryKey]: {
      name: primaryKey,
      type: FormFieldType.string,
      validate: value => null,
      // defaultValue: 'body.url',
      // help: '分享链接',
    },
  };*/

  return (
    <>
      {/*<pre>{util.inspect(columnOpts?.columnProps?.queryFields)}</pre>*/}
      {/*<pre>{util.inspect(fields)}</pre>*/}

      <PageHeader title={pane.title}>
        <EasyForm
          fields={fields}
          onSubmit={async values => {
            const keys = _.keys(fields);
            if (keys.length === 1 && keys.includes(primaryKey)) {
              const record = await AppContext.ctx.models
                .fetch(modelName, { id: values[primaryKey], relations })
                .then(fp.get('data'));
              setViewRecord(record);
            } else {
              const data = await AppContext.ctx.models.loadModels(modelName, { filters: values }).then(fp.get('data'));
              setViewRecord(_.head(data.items));
            }
          }}
          // onClear={() => ComponentsHelper.clear({ key, collection }, refetch)}
        />
      </PageHeader>

      <Divider type="horizontal" dashed={true} style={{ margin: '0.5rem 0' }} />

      <AsunaDataView modelName={modelName} extraName={extraName} data={viewRecord} onBack={() => setViewRecord(null)} />

      {/*
      <Divider type="horizontal" dashed={true} style={{ margin: '0.5rem 0' }} />

      <AsunaDataTable
        modelName={modelName}
        extraName={extraName}
        models={content.models}
        onView={(text, record) => setViewRecord(record)}
        rowClassName={columnOpts?.rowClassName}
      />
*/}
    </>
  );
};

const mapStateToProps = (rootState: RootState): { rootState: RootState } => ({ rootState });

export default connect(mapStateToProps)(ContentSearch);
