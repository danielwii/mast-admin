import { Button } from 'antd';
import { Promise } from 'bluebird';
import _ from 'lodash';
import * as React from 'react';
import { useLogger } from 'react-use';
import { Circle, FoldingCube } from 'styled-spinkit';
import * as util from 'util';
import { ErrorInfo } from './ErrorInfo';

export const WithLoading: React.FC<{ loading: boolean; error: any; retry? }> = ({
  loading,
  error,
  retry,
  children,
}) => {
  if (loading) return <FoldingCube />;
  if (error)
    return (
      <ErrorInfo>
        {retry && <Button onClick={() => retry()}>Reload</Button>}
        <pre>{util.inspect(error)}</pre>
      </ErrorInfo>
    );

  if (_.isFunction(children)) {
    const Component = children as React.FC;
    return <Component />;
  }

  return <>{children}</>;
};

export function WithFuture<R>({
  future,
  fallback,
  children,
}: {
  future: () => Promise<R>;
  fallback?: React.ReactElement;
  children: ((props: R) => React.ReactNode) | React.ReactNode;
}): React.ReactElement {
  const Component = React.lazy(
    () =>
      new Promise(async resolve => {
        const data = await future();
        resolve({
          default: () => (_.isFunction(children) ? <>{children(data)}</> : <>{children}</>),
        } as any);
      }),
  );

  useLogger(WithFuture.name);

  return (
    <React.Suspense fallback={fallback ?? <Circle />}>
      <Component />
    </React.Suspense>
  );
}

export function WithVariable<V>({
  variable,
  children,
}: {
  variable: V;
  children: (props: NonNullable<V>) => React.ReactNode;
}) {
  if (_.isNull(variable) || _.isUndefined(variable)) {
    return <span>n/a</span>;
  }
  return <>{children(variable as any)}</>;
}