import { ProgressBar } from '@asuna-admin/components';
import { PanesContainer, SideMenuRender } from '@asuna-admin/containers';
import { HeaderRender } from '@asuna-admin/containers/Header';
import { StoreContextProvider } from '@asuna-admin/context/store';
import { createLogger } from '@asuna-admin/logger';

import { Layout } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

import WithStyles from './with-styles';

const logger = createLogger('layout:main');
const { Sider } = Layout;

const StyledContentDiv = styled.div`
  background: #fff;
  padding: 0.5rem;
  margin: 0;
  min-height: 280px;
`;

const Main = ({ loading, heartbeat, auth, appInfo, hideCharacteristics }) => {
  logger.log('status', { loading, heartbeat, auth, appInfo });
  return (
    <StoreContextProvider>
      <WithStyles hideCharacteristics={hideCharacteristics}>
        <Layout>
          {/*{loading && <LivingLoading heartbeat={heartbeat} />}*/}
          <ProgressBar />
          <HeaderRender hideLogo={hideCharacteristics} />
          <Layout>
            <Sider theme={'light'} /*style={{ overflow: 'auto', height: '90vh', position: 'fixed', left: 0 }}*/>
              <SideMenuRender />
            </Sider>
            <Layout style={{ /*marginLeft: 200,*/ padding: '.5rem' }}>
              <StyledContentDiv>
                <PanesContainer />
              </StyledContentDiv>
            </Layout>
          </Layout>
        </Layout>
      </WithStyles>
    </StoreContextProvider>
  );
};

export default Main;
