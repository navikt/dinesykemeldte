import { within } from '@testing-library/react';

import { createAktivitetIkkeMuligPeriode, createGradertPeriode, createSykmelding } from '../../utils/test/dataCreators';
import { render, screen } from '../../utils/test/testUtils';

import SykmeldingPanel from './SykmeldingPanel';

describe('SykmeldingPanel', () => {
    it('should show correct info', async () => {
        render(<SykmeldingPanel sykmelding={createSykmelding()} />);

        const infoSection = within(screen.getByRole('region', { name: 'Opplysninger fra sykmeldingen' }));
        expect(infoSection.getByRole('listitem', { name: 'Sykmeldingen gjelder' })).toHaveTextContent('Test Testysson');
        expect(infoSection.getByRole('listitem', { name: 'Arbeidsgiver som legen har skrevet inn' })).toHaveTextContent(
            'Eplemostfabrikken AS',
        );

        const arbeidsSection = within(screen.getByRole('region', { name: 'Muligheter for arbeid' }));
        expect(arbeidsSection.getByRole('listitem', { name: 'Friskmelding/Prognose' })).toHaveTextContent(
            'Pasienten er ikke arbeidsfør etter denne perioden',
        );
        expect(
            arbeidsSection.getByRole('listitem', { name: 'Eventuelle hensyn som må tas på arbeidsplassen' }),
        ).toHaveTextContent('Flere pauser');
    });

    it('should show correct info given multiple periods', async () => {
        render(
            <SykmeldingPanel
                sykmelding={createSykmelding({
                    perioder: [createAktivitetIkkeMuligPeriode(), createGradertPeriode()],
                })}
            />,
        );

        expect(
            screen.getByRole('listitem', { name: 'Pasienten kan ikke være i arbeid (100% sykmelding)' }),
        ).toHaveTextContent('8. august 2021 - 15. august 2021');
        expect(screen.getByRole('listitem', { name: '67% sykmelding' })).toHaveTextContent(
            '16. august 2021 - 20. august 2021',
        );
    });

    it('should show arbeidsforEtterPeriode when true', () => {
        const fnr = '09640086212';

        render(<SykmeldingPanel sykmelding={createSykmelding({ fnr: fnr, arbeidsforEtterPeriode: true })} />);

        const infoSection = within(screen.getByRole('region', { name: 'Muligheter for arbeid' }));

        expect(infoSection.getByRole('listitem', { name: 'Friskmelding/Prognose' })).toHaveTextContent(
            /Pasienten er 100% arbeidsfør etter denne perioden/,
        );
    });

    it('should show arbeidsforEtterPeriode when false', () => {
        const fnr = '09640086212';

        render(<SykmeldingPanel sykmelding={createSykmelding({ fnr: fnr, arbeidsforEtterPeriode: false })} />);

        const infoSection = within(screen.getByRole('region', { name: 'Muligheter for arbeid' }));

        expect(infoSection.getByRole('listitem', { name: 'Friskmelding/Prognose' })).toHaveTextContent(
            /Pasienten er ikke arbeidsfør etter denne perioden/,
        );
    });

    it('should NOT display arbeidsforEtterPeriode when null', () => {
        const fnr = '09640086212';

        render(<SykmeldingPanel sykmelding={createSykmelding({ fnr: fnr, arbeidsforEtterPeriode: null })} />);

        const infoSection = within(screen.getByRole('region', { name: 'Muligheter for arbeid' }));

        expect(infoSection.queryByRole('listitem', { name: 'Friskmelding/Prognose' })).not.toBeInTheDocument();
    });
});
