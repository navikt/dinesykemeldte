import React, { useCallback } from 'react';
import { Cell, Grid, Heading, Loader } from '@navikt/ds-react';
import cn from 'classnames';

import { useMineSykmeldteQuery } from '../../graphql/queries/react-query.generated';
import { useApplicationContext } from '../shared/StateProvider';
import { partition } from '../../utils/tsUtils';
import { hasNotifications } from '../../utils/sykmeldtUtils';
import ExpandableSykmeldtPanel from '../shared/SykmeldtPanel/ExpandableSykmeldtPanel';

import useFilteredSykmeldte from './useFilteredSykmeldte';
import styles from './SykmeldteList.module.css';

function SykmeldteList(): JSX.Element {
    const { isLoading, data, error } = useMineSykmeldteQuery(undefined, { refetchOnWindowFocus: true });
    const filteredMineSykmeldte = useFilteredSykmeldte(data?.mineSykmeldte);
    const [state, dispatch] = useApplicationContext();
    const handleSykmeldtClick = useCallback(
        (id: string, where: 'root' | 'periods') => {
            if (where === 'root') {
                dispatch({ type: 'toggleExpandSykmeldte', payload: id });
            } else {
                dispatch({ type: 'toggleExpandSykmeldtPerioder', payload: id });
            }
        },
        [dispatch],
    );

    if (isLoading) {
        return <Loader aria-label="Laster dine ansatte" title="Laster dine ansatte" size="2xlarge" />;
    }

    if (error) {
        return <div>Klarte ikke å hente ansatte: {error.message}</div>;
    }

    const [notifying, nonNotifying] = partition(hasNotifications, filteredMineSykmeldte);

    return (
        <>
            {notifying.length > 0 && (
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
                                    expanded={state.expandedSykmeldte.includes(it.narmestelederId)}
                                    periodsExpanded={state.expandedSykmeldtPerioder.includes(it.narmestelederId)}
                                    onClick={handleSykmeldtClick}
                                />
                            </Cell>
                        ))}
                    </Grid>
                </section>
            )}
            {nonNotifying.length > 0 && (
                <section aria-label="Sykmeldte uten varsel">
                    <Grid>
                        {nonNotifying.map((it) => (
                            <Cell key={it.fnr} xs={12}>
                                <ExpandableSykmeldtPanel
                                    sykmeldt={it}
                                    notification={false}
                                    expanded={state.expandedSykmeldte.includes(it.narmestelederId)}
                                    periodsExpanded={state.expandedSykmeldtPerioder.includes(it.narmestelederId)}
                                    onClick={handleSykmeldtClick}
                                />
                            </Cell>
                        ))}
                    </Grid>
                </section>
            )}
        </>
    );
}

export default SykmeldteList;
