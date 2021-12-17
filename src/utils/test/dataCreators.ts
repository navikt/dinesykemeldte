import {
    ArbeidsrelatertArsakEnum,
    PreviewSoknadFragment,
    PreviewSykmeldingFragment,
    PreviewSykmeldtFragment,
    SoknadsstatusEnum,
    SykmeldingFragment,
    SykmeldingPeriode_AktivitetIkkeMulig_Fragment,
    SykmeldingPeriode_Gradert_Fragment,
} from '../../graphql/queries/react-query.generated';

export function createPreviewSoknad(overrides?: Partial<PreviewSoknadFragment>): PreviewSoknadFragment {
    return {
        id: 'default-soknad-1',
        fom: '2021-10-01',
        tom: '2021-10-20',
        lest: false,
        sendtDato: '2021-10-05',
        status: SoknadsstatusEnum.Sendt,
        sykmeldingId: 'default-sykmelding-1',
        ...overrides,
    };
}

export function createPreviewSykmelding(overrides?: Partial<PreviewSykmeldingFragment>): PreviewSykmeldingFragment {
    return {
        id: 'default-sykmelding-1',
        fom: '2021-10-01',
        tom: '2021-10-20',
        type: '100%',
        lest: false,
        ...overrides,
    };
}

export function createSykmelding(overrides?: Partial<SykmeldingFragment>): SykmeldingFragment {
    return {
        id: 'default-sykmelding-1',
        fnr: '08088033221',
        lest: false,
        navn: 'Test Testysson',
        startdatoSykefravar: '2020-05-05',
        arbeidsforEtterPeriode: false,
        tiltakArbeidsplassen: 'Flere pauser',
        arbeidsgiver: {
            navn: 'Eplemostfabrikken AS',
            yrke: 'Eplemoser',
        },
        behandler: {
            navn: 'B. Handlersson',
            telefon: '81549300',
        },
        perioder: [],
        ...overrides,
    };
}

export function createAktivitetIkkeMuligPeriode(
    overrides?: Partial<Pick<SykmeldingPeriode_AktivitetIkkeMulig_Fragment, 'fom' | 'tom' | 'arbeidsrelatertArsak'>>,
): SykmeldingPeriode_AktivitetIkkeMulig_Fragment {
    return {
        __typename: 'AktivitetIkkeMulig',
        fom: '2021-08-08',
        tom: '2021-08-15',
        arbeidsrelatertArsak: {
            arsak: [ArbeidsrelatertArsakEnum.ManglendeTilrettelegging],
            beskrivelse: 'Veldig årsak',
        },
        ...overrides,
    };
}

export function createGradertPeriode(
    overrides?: Partial<SykmeldingPeriode_Gradert_Fragment>,
): SykmeldingPeriode_Gradert_Fragment {
    return {
        __typename: 'Gradert',
        fom: '2021-08-16',
        tom: '2021-08-20',
        grad: 67,
        reisetilskudd: false,
        ...overrides,
    };
}

export function createPreviewSykmeldt(overrides?: Partial<PreviewSykmeldtFragment>): PreviewSykmeldtFragment {
    return {
        navn: 'Ola Normann',
        fnr: '08088012345',
        orgnummer: '123456789',
        friskmeldt: false,
        narmestelederId: 'narmesteleder-1',
        startdatoSykefravar: '2021-06-07',
        previewSykmeldinger: [createPreviewSykmelding()],
        previewSoknader: [],
        ...overrides,
    };
}
