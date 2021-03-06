import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { StepProps } from 'antd/es/steps';
import * as React from 'react';
import { useState } from 'react';

const { Step } = Steps;

export interface ITwoFactorAuthenticationProps {}

interface IState {
  initialized: boolean;
  loading: boolean;
  steps: StepProps[];
}

/**
 * 1 - 检测是否已绑定，同步时间
 * 2 - 生成 token，qrcode，同步时间
 * 3 - 验证
 * 4 - 完成
 * @param props
 * @constructor
 */
export const TwoFactorAuthentication = (props: ITwoFactorAuthenticationProps) => {
  const {} = props;
  const [state, setState] = useState<IState>({
    initialized: true,
    loading: false,
    steps: [{ status: 'wait' }, { status: 'wait' }, { status: 'wait' }, { status: 'wait' }],
  });

  const renderedSteps = (
    <>
      <Steps>
        <Step status="error" title="检测" icon={<UserOutlined />} />
        <Step status="finish" title="绑定" icon={<SolutionOutlined />} />
        <Step status="process" title="验证" icon={<LoadingOutlined />} />
        <Step status="wait" title="完成" icon={<SmileOutlined />} />
      </Steps>
    </>
  );

  // 检测是否已绑定，如果已绑定，显示基本信息、时间戳，已经删除/验证按钮。
  // 否则，下一步申请 token，生成 qrcode。
  const content = <div></div>;

  return (
    <div>
      {renderedSteps}
      {content}
    </div>
  );
};
