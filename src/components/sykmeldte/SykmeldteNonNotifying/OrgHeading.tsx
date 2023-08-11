import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

interface Props {
    orgname: string
}

function OrgHeading({ orgname }: Props): ReactElement {
    return (
        <Heading className="mt-2 pb-4" size="xsmall" level="3" spacing>
            {orgname}
        </Heading>
    )
}

export default OrgHeading
