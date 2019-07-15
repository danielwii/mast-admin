import { isJson } from '@asuna-admin/helpers';
import { createLogger } from '@asuna-admin/logger';

import * as _ from 'lodash';

import { AppContext } from '.';

const logger = createLogger('core:url-rewriter');

export function valueToArrays(value) {
  const castToArrays = value =>
    isJson(value) ? JSON.parse(value as string) : _.compact(value.split(','));
  const images = value ? (_.isArray(value) ? value : castToArrays(value)) : [];
  logger.debug('[valueToArrays]', { value, images });
  return images;
}

export function joinUrl(base?: string, path?: string): string {
  const safeBase = base || '';
  const endpoint = safeBase.endsWith('/') ? safeBase : `${safeBase}/`;
  return endpoint + `/${path || ''}`.replace('//', '/').slice(1);
}

export function valueToUrl(
  value,
  {
    host,
    type,
    thumbnail,
  }: {
    host?: string;
    type?: 'image' | 'video' | 'attache' | 'file';
    thumbnail?: { width?: number; height?: number };
  },
) {
  if (value) {
    // const base = host || Config.get('UPLOADS_ENDPOINT') || '';
    // let url = joinUrl(base, value);
    // response value param fullpath already includes uploads path
    let url = value;
    if (thumbnail) {
      const template = _.get(
        AppContext.serverSettings['settings.url-resolver'],
        'value.uploads',
        '',
      );
      if (!(_.isString(template) && template.includes('{{ url }}'))) {
        logger.log('template for settings.url-resolver/value.uploads dose not exists or valid.');
        return url;
      }
      try {
        url = template.replace('{{ url }}', url);
      } catch (e) {
        logger.warn('using template error', { template, url });
      }
      // url += `?imageView2/2/w/${thumbnail.width || 1280}/h/${thumbnail.height ||
      //   1280}/format/jpg/interlace/1/ignore-error/1`;
    }
    logger.debug('[valueToUrl]', { value, url, host });
    return url;
  }
  return '';
}
