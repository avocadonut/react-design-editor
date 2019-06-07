import i18n from 'i18next';

const NODE_COLORS = {
    MARKER: {
        fill: '#48C9B0',
        border: '#1ABC9C',
    },
    TEXT: {
        fill: '#AF7AC5',
        border: '#9B59B6',
    },
    IMAGE: {
        fill: '#5DADE2',
        border: '#3498DB',
    },
    SHAPE: {
        fill: '#F5B041',
        border: 'rgb(243, 156, 18)',
    },
    DRAWING: {
        fill: '#AF7AC5',
        border: '#9B59B6',
    },
    ELEMENT: {
        fill: '#5DADE2',
        border: '#3498DB',
    },
};

const OUT_PORT_TYPE = {
    SINGLE: 'SINGLE',
    STATIC: 'STATIC',
    DYNAMIC: 'DYNAMIC',
    BROADCAST: 'BROADCAST',
};

const DESCRIPTIONS = {
    script: i18n.t('common.name'),
    template: i18n.t('common.name'),
    json: i18n.t('common.name'),
    cron: i18n.t('common.name'),
};

export {
    NODE_COLORS,
    OUT_PORT_TYPE,
    DESCRIPTIONS,
};
