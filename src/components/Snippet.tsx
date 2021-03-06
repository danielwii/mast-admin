/** @jsxRuntime classic */
/** @jsx jsx */
import { valueToArrays } from '@asuna-admin/core/url-rewriter';
import { TooltipContent } from '@asuna-admin/helpers';
import { jsx } from '@emotion/react';
import { AssetPreview } from 'asuna-components';
import * as _ from 'lodash';
import dynamic from 'next/dynamic';
import React from 'react';
import { ImageDecorator } from 'react-viewer/lib/ViewerProps';

const Viewer = dynamic(import('react-viewer'), { ssr: false });

export function ReactViewer({
  images,
  index,
  children,
}: { images: ImageDecorator[]; index: number } & { children?: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);

  return (
    <React.Fragment>
      <a onClick={() => setVisible(true)}>{children}</a>
      <Viewer
        activeIndex={index}
        visible={visible}
        onClose={() => setVisible(false)}
        onMaskClick={() => setVisible(false)}
        images={images}
        downloadable
        downloadInNewWindow
      />
    </React.Fragment>
  );
}

interface IAssetsPreviewProps {
  host?: string;
  urls: string[] | string;
  showPdf?: boolean;
  clearStyle?: boolean;
}

export function AssetsPreview({ host, urls, showPdf, clearStyle }: IAssetsPreviewProps) {
  const parsed = valueToArrays(urls);
  return (
    <div style={clearStyle ? {} : { display: 'flex', flexWrap: 'wrap', maxWidth: '400px' }}>
      {_.map(parsed, (url, index) => (
        <div key={`viewer-${index}`} style={{ display: 'inline-block' }}>
          <ReactViewer index={index} images={parsed.map((url) => ({ src: url, downloadUrl: url }))}>
            <AssetPreview key={url} host={host} url={url} showPdf={showPdf} />
          </ReactViewer>
          <TooltipContent value={url} link />
        </div>
      ))}
    </div>
  );
}
