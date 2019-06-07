import React, { Component } from 'react';
import { Button, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import Adsense from 'react-adsense';

import { FlexBox } from '../components/flex';
// import Icon from '../components/icon/Icon';

class Title extends Component {
    static propTypes = {
        currentMenu: PropTypes.string,
        onChangeMenu: PropTypes.func,
    }

    handlers = {
        goGithub: () => {
            window.open('https://github.com/salgum1114/react-design-editor');
        },
    }

    render() {
        return (
            <FlexBox style={{ background: 'linear-gradient(141deg,#ff1400,#ff6b27 46%,#ff8f3e 69%)'}} flexWrap="wrap" flex="1" alignItems="center">
                <FlexBox style={{ marginLeft: 8 }} flex="0 1 auto">
                    <span style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>Ad Builder</span>
                    <Button
                        className="rde-action-btn"
                        style={{
                            color: 'white',
                        }}
                        shape="circle"
                        size="large"
                        onClick={this.handlers.goGithub}
                    >
                        <Icon src="https://files.slack.com/files-pri/TDGLNEH5Z-FH0TGGDCK/ubp-logo-refresh__1_.png" prefix="fab" size={1.5} />
                    </Button>
                </FlexBox>
                <FlexBox style={{ marginLeft: 88 }}>
                    <Menu mode="horizontal" theme="light" style={{ background: 'transparent', fontSize: '24px', borderRadius: '5px' }} onClick={this.props.onChangeMenu} selectedKeys={[this.props.current]}>
                        <Menu.Item key="imagemap" style={{ color: '#fff' }}>{i18n.t('imagemap.imagemap')}</Menu.Item>
                        <Menu.Item key="selecttemplate" style={{ color: '#fff' }}>{i18n.t('selecttemplate.selecttemplate')}</Menu.Item>
                        <Menu.Item key="workflow" style={{ color: '#ff1400' }}>{i18n.t('workflow.workflow')}</Menu.Item>
                    </Menu>
                </FlexBox>
                {/* <FlexBox flex="1" justifyContent="flex-end">
                    <Adsense.Google
                        client="ca-pub-8569372752842198"
                        slot="5790685139"
                        style={{ display: 'inline-block', width: 600, height: 60 }}
                    />
                </FlexBox> */}
            </FlexBox>
        );
    }
}

export default Title;
