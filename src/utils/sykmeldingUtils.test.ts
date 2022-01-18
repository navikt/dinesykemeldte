import {
    SykmeldingPeriode_AktivitetIkkeMulig_Fragment,
    SykmeldingPeriode_Avventende_Fragment,
    SykmeldingPeriode_Behandlingsdager_Fragment,
    SykmeldingPeriode_Gradert_Fragment,
    SykmeldingPeriode_Reisetilskudd_Fragment,
} from '../graphql/queries/react-query.generated';

import { getSykmeldingPeriodDescription } from './sykmeldingUtils';

describe('getSykmeldingPeriodDescription', () => {
    it('Avventende periode', () => {
        const period: SykmeldingPeriode_Avventende_Fragment = {
            __typename: 'Avventende',
            fom: '2021-04-01',
            tom: '2021-04-03',
            tilrettelegging: 'Dette er et innspill',
        };
        expect(getSykmeldingPeriodDescription(period)).toBe('Avventende sykmelding i 3 dager');
    });

    it('100% periode', () => {
        const period: SykmeldingPeriode_AktivitetIkkeMulig_Fragment = {
            __typename: 'AktivitetIkkeMulig',
            fom: '2021-04-01',
            tom: '2021-04-03',
            arbeidsrelatertArsak: null,
        };
        expect(getSykmeldingPeriodDescription(period)).toBe('100% sykmeldt i 3 dager');
    });

    it('Gradert periode', () => {
        const period: SykmeldingPeriode_Gradert_Fragment = {
            __typename: 'Gradert',
            fom: '2021-04-01',
            tom: '2021-04-03',
            grad: 80,
            reisetilskudd: false,
        };
        expect(getSykmeldingPeriodDescription(period)).toBe('80% sykmeldt i 3 dager');
    });

    it('Reisetilskudd periode', () => {
        const period: SykmeldingPeriode_Reisetilskudd_Fragment = {
            __typename: 'Reisetilskudd',
            fom: '2021-04-01',
            tom: '2021-04-03',
        };
        expect(getSykmeldingPeriodDescription(period)).toBe('Reisetilskudd i 3 dager');
    });

    it('1 behandlingsdag periode', () => {
        const period: SykmeldingPeriode_Behandlingsdager_Fragment = {
            __typename: 'Behandlingsdager',
            fom: '2021-04-01',
            tom: '2021-04-03',
            behandlingsdager: 1,
        };

        expect(getSykmeldingPeriodDescription(period)).toBe('1 behandlingsdag i løpet av 3 dager');
    });

    it('Flere behandlingsdager periode', () => {
        const period: SykmeldingPeriode_Behandlingsdager_Fragment = {
            __typename: 'Behandlingsdager',
            fom: '2021-04-01',
            tom: '2021-04-03',
            behandlingsdager: 2,
        };
        expect(getSykmeldingPeriodDescription(period)).toBe('2 behandlingsdager i løpet av 3 dager');
    });
});
