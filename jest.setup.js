/* eslint-disable @typescript-eslint/no-var-requires */

import 'next';
import '@testing-library/jest-dom/extend-expect';

import { TextDecoder, TextEncoder } from 'util';

import { Modal } from '@navikt/ds-react';
import mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';

jest.mock('next/router', () => require('next-router-mock'));
// This seems like a temporary hack, will probably be fixed in next-router-mock
jest.mock('next/dist/shared/lib/router-context', () => {
    const { createContext } = require('react');
    const router = require('next-router-mock').default;
    const RouterContext = createContext(router);
    return { RouterContext };
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

window.scrollTo = jest.fn();
window.HTMLElement.prototype.scrollIntoView = () => void 0;

Modal.setAppElement(document.createElement('div'));

mockRouter.useParser(
    createDynamicRouteParser([
        '/sykmeldt/[sykmeldtId]',
        '/sykmeldt/[sykmeldtId]/soknader',
        '/sykmeldt/[sykmeldtId]/sykmeldinger',
        '/sykmeldt/[sykmeldtId]/soknad/[soknadId]',
        '/sykmeldt/[sykmeldtId]/sykmelding/[sykmeldingId]',
    ]),
);

// Custom rewrites to mimic the behaviour of the server
mockRouter.useParser((url) => {
    if (url.pathname === '/') {
        url.query.sykmeldtId = 'null';
    }
    if (url.pathname === '/sykmeldt/:sykmeldtId') {
        url.pathname = '/:sykmeldtId';
    }
    return url;
});

jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
        publicPath: '/fake/basepath',
        runtimeEnv: 'test',
    },
}));

/*
jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
    createRemoteJWKSet: jest.fn(),
}));
 */

process.env.DEBUG_PRINT_LIMIT = '30000';
