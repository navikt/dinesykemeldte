import React from 'react'
import { BodyShort, Button, Heading } from '@navikt/ds-react'
import { Print } from '@navikt/ds-icons'

import { SoknadFragment } from '../../graphql/queries/graphql.generated'
import { ListItem } from '../shared/listItem/ListItem'
import { formatDate } from '../../utils/dateUtils'
import { shouldSporsmalVariantShow, getSoknadSykmeldingPeriod } from '../../utils/soknadUtils'
import { addSpaceAfterEverySixthCharacter } from '../../utils/stringUtils'

import { SporsmalVarianter } from './SporsmalVarianter/SporsmalVarianter'
import SoknadPerioder from './SoknadPerioder'
import styles from './SoknadPanel.module.css'

interface Props {
    soknad: SoknadFragment
}

function SoknadPanel({ soknad }: Props): JSX.Element {
    return (
        <section className={styles.soknadPanelRoot} aria-labelledby="soknad-oppsummering-section">
            <div className={styles.header}>
                <Heading id="soknad-oppsummering-section" size="small" level="2">
                    Oppsummering fra søknaden
                </Heading>
                <div className={styles.periods}>
                    {soknad.perioder.map((it) => (
                        <BodyShort key={it.fom} className={styles.period} size="small">
                            {getSoknadSykmeldingPeriod(it)}
                        </BodyShort>
                    ))}
                </div>
                <div className={styles.sentDateAndPrint}>
                    <BodyShort className={styles.sendtDate} size="small">
                        {`Sendt til deg ${formatDate(soknad.sendtDato)}`}
                    </BodyShort>
                    <Button
                        onClick={() => window.print()}
                        variant="tertiary"
                        className={styles.printButton}
                        icon={<Print title="Lag PDF versjon av søknaden" />}
                    />
                </div>
            </div>
            <ul className={styles.soknadOppsummeringList}>
                <ListItem
                    title="Søknaden er sendt inn av"
                    text={[soknad.navn, addSpaceAfterEverySixthCharacter(soknad.fnr)]}
                    headingLevel="3"
                    blueListItem
                />
                {soknad.perioder.length > 0 && <SoknadPerioder perioder={soknad.perioder} />}
                {soknad.sporsmal
                    .filter((spm) => shouldSporsmalVariantShow(spm))
                    .map((sporsmal) => {
                        return <SporsmalVarianter key={sporsmal.id} sporsmal={sporsmal} />
                    })}
            </ul>
        </section>
    )
}

export default SoknadPanel
