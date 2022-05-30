import React, { useEffect } from 'react';
import { Cell, Grid, Heading } from '@navikt/ds-react';
import cn from 'classnames';
import { useQuery } from '@apollo/client';
import { batch, useDispatch } from 'react-redux';

import { MineSykmeldteDocument } from '../../graphql/queries/graphql.generated';
import { partition } from '../../utils/tsUtils';
import { notificationCount } from '../../utils/sykmeldtUtils';
import ExpandableSykmeldtPanel from '../shared/SykmeldtPanel/ExpandableSykmeldtPanel';
import PageFallbackLoader from '../shared/pagefallbackloader/PageFallbackLoader';
import ErrorBoundary from '../shared/errors/ErrorBoundary';
import PageError from '../shared/errors/PageError';
import useParam, { RouteLocation } from '../../hooks/useParam';
import expandedSlice from '../../state/expandedSlice';
import filterSlice from '../../state/filterSlice';
import useFocusRefetch from '../../hooks/useFocusRefetch';
import { previewNySoknaderRead } from '../../utils/soknadUtils';

import useFilteredSykmeldte from './useFilteredSykmeldte';
import PaginatedSykmeldteList from './PaginatedSykmeldteList';
import { useExpanded, useExpandSykmeldte } from './useExpandSykmeldte';
import styles from './SykmeldteList.module.css';

function SykmeldteList(): JSX.Element {
    const { loading, data, error, refetch } = useQuery(MineSykmeldteDocument);
    const { sykmeldtId: focusSykmeldtId } = useParam(RouteLocation.Root);
    const dispatch = useDispatch();

    useFocusRefetch(refetch);

    useEffect(() => {
        if (!focusSykmeldtId) return;

        batch(() => {
            dispatch(filterSlice.actions.setName(''));
            dispatch(filterSlice.actions.setShow('all'));
            dispatch(expandedSlice.actions.setExpandSykmeldt(focusSykmeldtId));
        });
    }, [dispatch, focusSykmeldtId]);

    const { expandedSykmeldte, expandedSykmeldtPerioder } = useExpanded();
    const handleSykmeldtClick = useExpandSykmeldte(focusSykmeldtId, expandedSykmeldte);
    const filteredMineSykmeldte = useFilteredSykmeldte(data?.mineSykmeldte);

    if (loading && !data) {
        return <PageFallbackLoader text="Laster dine ansatte" />;
    }

    if (error) {
        return <PageError text="Klarte ikke å hente dine sykmeldte" />;
    }

    const [notifyingAndNotSendtSoknader, nonNotifying] = partition(
        (it) =>
            notificationCount(it) > 0 ||
            (notificationCount(it) === 0 && previewNySoknaderRead(it.previewSoknader).length > 0),
        filteredMineSykmeldte,
    );
    const [notSendtSoknader, notifying] = partition(
        (it) => previewNySoknaderRead(it.previewSoknader).length > 0 && notificationCount(it) === 0,
        notifyingAndNotSendtSoknader,
    );

    return (
        <ErrorBoundary>
            {notifyingAndNotSendtSoknader.length > 0 && (
                <section
                    aria-labelledby="sykmeldte-nye-varsler-liste"
                    className={cn({
                        [styles.notifyingSectionHasFollwingSection]: nonNotifying.length > 0,
                    })}
                >
                    <Heading id="sykmeldte-nye-varsler-liste" size="small" level="2" spacing>
                        Nye varsler
                    </Heading>
                    <Grid>
                        {notifying.map((it) => (
                            <Cell key={it.fnr} xs={12}>
                                <ExpandableSykmeldtPanel
                                    sykmeldt={it}
                                    notification
                                    expanded={expandedSykmeldte.includes(it.narmestelederId)}
                                    periodsExpanded={expandedSykmeldtPerioder.includes(it.narmestelederId)}
                                    onClick={handleSykmeldtClick}
                                    focusSykmeldtId={focusSykmeldtId}
                                />
                            </Cell>
                        ))}
                        {notSendtSoknader.map((it) => (
                            <Cell key={it.fnr} xs={12}>
                                <ExpandableSykmeldtPanel
                                    sykmeldt={it}
                                    notification={false}
                                    expanded={expandedSykmeldte.includes(it.narmestelederId)}
                                    periodsExpanded={expandedSykmeldtPerioder.includes(it.narmestelederId)}
                                    onClick={handleSykmeldtClick}
                                    focusSykmeldtId={focusSykmeldtId}
                                />
                            </Cell>
                        ))}
                    </Grid>
                </section>
            )}
            {nonNotifying.length > 0 && (
                <section aria-label="Sykmeldte uten varsel">
                    <PaginatedSykmeldteList sykmeldte={nonNotifying} focusSykmeldtId={focusSykmeldtId} />
                </section>
            )}
        </ErrorBoundary>
    );
}

export default SykmeldteList;
