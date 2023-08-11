import { PersonSuitIcon } from '@navikt/aksel-icons'
import { ReactElement } from 'react'

import { SykmeldingFragment } from '../../graphql/queries/graphql.generated'
import { cleanId } from '../../utils/stringUtils'
import { IconHeading } from '../shared/IconHeading/IconHeading'
import { ListItem } from '../shared/listItem/ListItem'

interface Props {
    sykmelding: SykmeldingFragment
}

const title = 'Melding til arbeidsgiver'

function MeldingTilArbeidsgiver({ sykmelding }: Props): ReactElement | null {
    if (!sykmelding.innspillArbeidsplassen) return null
    const listItemId = cleanId(title)

    return (
        <li className="pb-4" aria-labelledby={listItemId}>
            <IconHeading title={title} headingId={listItemId} Icon={PersonSuitIcon} />
            <ul className="list-none rounded bg-blue-50 p-5">
                <ListItem title="Innspill til arbeidsgiver" text={sykmelding.innspillArbeidsplassen} headingLevel="4" />
            </ul>
        </li>
    )
}

export default MeldingTilArbeidsgiver
