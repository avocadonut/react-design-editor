import React from 'react';
import { Form, Radio, Row, Col, Switch } from 'antd';
import UrlModal from '../../common/UrlModal';
import FileUpload from '../../common/FileUpload';

export default {
    render(canvasRef, form, data) {
        const { getFieldDecorator } = form;
        if (!data) {
            return null;
        }
        const videoLoadType = data.video.type || 'file';
        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item label="Auto Play" colon={false}>
                            {
                                getFieldDecorator('video.autoplay', {
                                    rules: [{
                                        type: 'boolean',
                                    }],
                                    valuePropName: 'checked',
                                    initialValue: data.video.autoplay,
                                })(
                                    <Switch />,
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Muted" colon={false}>
                            {
                                getFieldDecorator('video.muted', {
                                    rules: [{
                                        type: 'boolean',
                                    }],
                                    valuePropName: 'checked',
                                    initialValue: data.video.muted,
                                })(
                                    <Switch />,
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Loop" colon={false}>
                            {
                                getFieldDecorator('video.loop', {
                                    rules: [{
                                        type: 'boolean',
                                    }],
                                    valuePropName: 'checked',
                                    initialValue: data.video.loop,
                                })(
                                    <Switch />,
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Video Load Type" colon={false}>
                    {
                        getFieldDecorator('video.type', {
                            initialValue: videoLoadType,
                        })(
                            <Radio.Group size="large">
                                <Radio.Button value="file">File Upload</Radio.Button>
                                <Radio.Button value="src">Video URL</Radio.Button>
                            </Radio.Group>,
                        )
                    }
                </Form.Item>
                {
                    videoLoadType === 'file' ? (
                        <Form.Item label="File" colon={false}>
                            {
                                getFieldDecorator('video.file', {
                                    rules: [{
                                        required: true,
                                        message: 'Please select video',
                                    }],
                                    initialValue: data.video.file,
                                })(
                                    // <FileUpload fileList={data.file ? [data.file] : []} />,
                                    <FileUpload accept="video/*" />,
                                )
                            }
                        </Form.Item>
                    ) : (
                        <Form.Item>
                            {
                                getFieldDecorator('video.src', {
                                    rules: [{
                                        required: true,
                                        message: 'Please input src',
                                    }],
                                    initialValue: data.video.src,
                                })(
                                    <UrlModal form={form} />,
                                )
                            }
                        </Form.Item>
                    )
                }
            </React.Fragment>
        );
    },
};
