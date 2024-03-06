import { ReactElement } from 'react'
import { BodyShort } from '@navikt/ds-react'

interface Props {
    text: string
}

function SykmeldingInfoMissing({ text }: Props): ReactElement {
    return (
        <div className="text-gray-600">
            <BodyShort size="small" as="em">
                {text}
            </BodyShort>
        </div>
    )
}

export default SykmeldingInfoMissing
