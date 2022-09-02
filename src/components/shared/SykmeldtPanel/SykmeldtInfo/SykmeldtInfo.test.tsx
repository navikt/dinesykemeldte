import userEvent from '@testing-library/user-event';
import { waitForElementToBeRemoved } from '@testing-library/react';

import { render, screen } from '../../../../utils/test/testUtils';
import { createInitialQuery, createMock, createPreviewSykmeldt } from '../../../../utils/test/dataCreators';
import { MineSykmeldteDocument, UnlinkSykmeldtDocument } from '../../../../graphql/queries/graphql.generated';

import SykmeldtInfo from './SykmeldtInfo';

describe('SykmeldtInfo', () => {
    it('modal should open and close', async () => {
        render(<SykmeldtInfo sykmeldt={createPreviewSykmeldt()} />, {
            initialState: [
                createInitialQuery(MineSykmeldteDocument, {
                    __typename: 'Query',
                    mineSykmeldte: [createPreviewSykmeldt()],
                }),
            ],
        });

        await userEvent.click(screen.getByRole('button', { name: 'Fjern fra min oversikt' }));
        expect(screen.getByRole('dialog', { name: 'Meld fra om endring' })).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should unlink the sykmeldt and refetch sykmeldte list on click', async () => {
        const sykmeldtId = 'sykme-id-1';
        const unlinkDone = jest.fn();
        const refetchComplete = jest.fn();

        const mockUnlink = createMock({
            request: { query: UnlinkSykmeldtDocument, variables: { sykmeldtId } },
            result: () => {
                unlinkDone();
                return { data: { __typename: 'Mutation' as const, unlinkSykmeldt: true } };
            },
        });
        const mockRefetchMineSykmeldte = createMock({
            request: { query: MineSykmeldteDocument },
            result: () => {
                refetchComplete();
                return { data: { __typename: 'Query' as const, mineSykmeldte: [] } };
            },
        });

        render(<SykmeldtInfo sykmeldt={createPreviewSykmeldt({ narmestelederId: sykmeldtId })} />, {
            initialState: [
                createInitialQuery(MineSykmeldteDocument, {
                    __typename: 'Query',
                    mineSykmeldte: [createPreviewSykmeldt()],
                }),
            ],
            mocks: [mockUnlink, mockRefetchMineSykmeldte],
        });

        await userEvent.click(screen.getByRole('button', { name: 'Fjern fra min oversikt' }));
        await userEvent.click(screen.getByRole('button', { name: 'Ja, fjern fra min oversikt' }));

        await waitForElementToBeRemoved(() => screen.queryByRole('dialog', { name: 'Meld fra om endring' }));
        expect(unlinkDone).toHaveBeenCalled();
        expect(refetchComplete).toHaveBeenCalled();
    });
});
