import { AssetPreview } from '@asuna-admin/components';
import { createLogger } from '@asuna-admin/logger';

import { Form } from 'antd';
import * as _ from 'lodash';
import * as React from 'react';

import { horizontalFormItemLayout, IFormItemLayout, PlainOptions } from '.';

const logger = createLogger('components:dynamic-form:elements:plain');

interface IPlainImagesProps {
  options: PlainOptions;
  formItemLayout?: IFormItemLayout;
}

export function PlainImages({ options, formItemLayout }: IPlainImagesProps) {
  const { key, label, text, help } = options;
  logger.log('[PlainImages]', { options });
  const fieldName = key || name;
  const labelName = label || name || key;
  const assets = _.isArray(text) ? text : _.isString(text) ? text.split(',') : text;
  // const host = Config.get('UPLOADS_ENDPOINT', '');
  return (
    <Form.Item key={fieldName} {...(formItemLayout || horizontalFormItemLayout)} label={labelName} help={help}>
      {_.map(assets, asset => (
        <AssetPreview key={asset} url={asset} showPdf fullWidth />
      ))}
    </Form.Item>
  );
}
