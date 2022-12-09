import React from 'react'
import { BodyShort, Heading } from '@navikt/ds-react'
import { useQuery } from '@apollo/client'

import { SykmeldingByIdDocument } from '../../graphql/queries/graphql.generated'
import { formatDate, formatDatePeriod } from '../../utils/dateUtils'
import { ListItem } from '../shared/listItem/ListItem'
import PageFallbackLoader from '../shared/pagefallbackloader/PageFallbackLoader'
import { getSykmeldingPeriodDescription } from '../../utils/sykmeldingPeriodUtils'
import PageError from '../shared/errors/PageError'
import { addSpaceAfterEverySixthCharacter } from '../../utils/stringUtils'

import styles from './SykmeldingPanelShort.module.css'

interface Props {
    sykmeldingId: string
}

function SykmeldingPanelShort({ sykmeldingId }: Props): JSX.Element {
    const { data, loading, error } = useQuery(SykmeldingByIdDocument, { variables: { sykmeldingId } })

    if (loading) return <PageFallbackLoader text="Laster sykmelding" />
    if (error || !data?.sykmelding) return <PageError text="Klarte ikke å laste søknadens sykmelding" />

    return (
        <section className={styles.panelRoot} aria-labelledby="sykmeldinger-panel-info-section">
            <div className={styles.header}>
                <Heading size="small" level="2" id="sykmeldinger-panel-info-section">
                    Opplysninger fra sykmeldingen
                </Heading>
                {data.sykmelding.sendtTilArbeidsgiverDato && (
                    <BodyShort className={styles.sendtDate} size="small">
                        {`Sendt til deg ${formatDate(data.sykmelding.sendtTilArbeidsgiverDato)}`}
                    </BodyShort>
                )}
            </div>
            <ul className={styles.sykmeldingOpplysningerList}>
                <ListItem
                    title="Sykmeldingen gjelder"
                    text={[data.sykmelding.navn, addSpaceAfterEverySixthCharacter(data.sykmelding.fnr)]}
                    headingLevel="3"
                />
                <li className={styles.listItem}>
                    <Heading size="xsmall" className={styles.periodHeading} level="3">
                        Sykmeldingen gjelder for perioden
                    </Heading>
                    {data.sykmelding.perioder.map((it, index) => (
                        <div className={styles.period} key={index}>
                            <BodyShort>{formatDatePeriod(it.fom, it.tom)}</BodyShort>
                            <BodyShort>{getSykmeldingPeriodDescription(it)}</BodyShort>
                        </div>
                    ))}
                </li>
                <ListItem
                    title="Arbeidsgiver som legen har skrevet inn"
                    text={data.sykmelding.arbeidsgiver.navn ?? 'Ukjent'}
                    headingLevel="3"
                />
                <ListItem
                    title="Dato sykmeldingen ble skrevet"
                    text={formatDate(data.sykmelding.behandletTidspunkt)}
                    headingLevel="3"
                />
            </ul>
        </section>
    )
}

export default SykmeldingPanelShort
