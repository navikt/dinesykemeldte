import { Alert } from '@navikt/ds-react'
import React, { ReactElement } from 'react'

import { isLocalOrDemo } from '../../utils/env'

export function LabsWarning(): ReactElement | null {
    if (!isLocalOrDemo) {
        return null
    }

    return (
        <Alert className="mx-auto my-8 w-4/5 max-w-4xl" variant="warning">
            Dette er en demoside og inneholder ikke dine personlige data.
        </Alert>
    )
}
