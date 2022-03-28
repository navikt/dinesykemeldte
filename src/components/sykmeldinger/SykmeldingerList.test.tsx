import { createInitialQuery, createSykmelding, createPreviewSykmeldt } from '../../utils/test/dataCreators';
import { render, screen, within } from '../../utils/test/testUtils';
import { SykmeldingByIdDocument } from '../../graphql/queries/graphql.generated';

import SykmeldingerList from './SykmeldingerList';

describe('SykmeldingerList', () => {
    it('should render sykmeldinger in sections according to lest status', () => {
        render(
            <SykmeldingerList
                sykmeldtId="test-id"
                sykmeldt={createPreviewSykmeldt({
                    sykmeldinger: [
                        createSykmelding({ id: 'sykmelding-1', lest: false }),
                        createSykmelding({ id: 'sykmelding-2', lest: true }),
                        createSykmelding({ id: 'sykmelding-2', lest: false }),
                    ],
                })}
            />,
            {
                initialState: [
                    createInitialQuery(
                        SykmeldingByIdDocument,
                        { __typename: 'Query', sykmelding: createSykmelding({ id: 'sykmelding-1' }) },
                        { sykmeldingId: 'sykmelding-1' },
                    ),
                    createInitialQuery(
                        SykmeldingByIdDocument,
                        { __typename: 'Query', sykmelding: createSykmelding({ id: 'sykmelding-2' }) },
                        { sykmeldingId: 'sykmelding-2' },
                    ),
                    createInitialQuery(
                        SykmeldingByIdDocument,
                        { __typename: 'Query', sykmelding: createSykmelding({ id: 'sykmelding-3' }) },
                        { sykmeldingId: 'sykmelding-3' },
                    ),
                ],
            },
        );

        const unreadSection = within(screen.getByRole('region', { name: 'Uleste' }));
        expect(unreadSection.getAllByRole('link', { name: /Sykmelding/ })).toHaveLength(2);

        const readSection = within(screen.getByRole('region', { name: 'Leste' }));
        expect(readSection.getAllByRole('link', { name: /Sykmelding/ })).toHaveLength(1);
    });

    it('should link to the correct path', () => {
        render(
            <SykmeldingerList
                sykmeldtId="test-id"
                sykmeldt={createPreviewSykmeldt({
                    sykmeldinger: [createSykmelding({ id: 'sykmelding-1' })],
                })}
            />,
            {
                initialState: [
                    createInitialQuery(
                        SykmeldingByIdDocument,
                        { __typename: 'Query', sykmelding: createSykmelding({ id: 'sykmelding-1' }) },
                        { sykmeldingId: 'sykmelding-1' },
                    ),
                ],
            },
        );

        expect(screen.getByRole('link', { name: /Sykmelding/ })).toHaveAttribute(
            'href',
            '/sykmeldt/test-id/sykmelding/sykmelding-1',
        );
    });
});
