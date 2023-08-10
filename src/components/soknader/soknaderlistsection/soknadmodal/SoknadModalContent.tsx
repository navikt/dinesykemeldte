import React, { ReactElement, useEffect } from 'react'
import { Button, Modal } from '@navikt/ds-react'
import { useMutation, useQuery } from '@apollo/client'

import {
    MarkSoknadReadDocument,
    MineSykmeldteDocument,
    PreviewSoknadFragment,
} from '../../../../graphql/queries/graphql.generated'
import { getSoknadActivationDate } from '../../../../utils/soknadUtils'
import { formatDate } from '../../../../utils/dateUtils'
import { logAmplitudeEvent } from '../../../../amplitude/amplitude'

interface Props {
    soknad: PreviewSoknadFragment
    labelId: string
    onOk: () => void
}

const SoknadModalContent = ({ soknad, labelId, onOk }: Props): ReactElement => {
    switch (soknad.__typename) {
        case 'PreviewFremtidigSoknad':
            return <FremtidigSoknadModal id={labelId} tom={soknad.tom} onClick={onOk} />
        case 'PreviewNySoknad':
            return <NySoknadModal id={labelId} soknadId={soknad.id} onClick={onOk} />
        case 'PreviewSendtSoknad':
            throw new Error('Sendt should not use this modal content')
    }
}

function NySoknadModal({ id, soknadId, onClick }: { id: string; soknadId: string; onClick: () => void }): ReactElement {
    const { refetch } = useQuery(MineSykmeldteDocument)
    const [markSoknadRead] = useMutation(MarkSoknadReadDocument)

    useEffect(() => {
        ;(async () => {
            logAmplitudeEvent({
                eventName: 'skjema fullført',
                data: { skjemanavn: 'marker ny søknad som lest (i modal)' },
            })
            await markSoknadRead({ variables: { soknadId } })
            await refetch()
        })()
    }, [markSoknadRead, refetch, soknadId])

    return (
        <Modal.Content className="p-6">
            <p id={id} className="mr-12">
                Den ansatte har ikke sendt inn denne søknaden ennå.
            </p>
            <p>Du blir varslet så fort den er sendt.</p>
            <div className="flex justify-center">
                <Button className="mt-4 min-w-[8rem]" variant="secondary" size="small" onClick={onClick}>
                    OK
                </Button>
            </div>
        </Modal.Content>
    )
}

function FremtidigSoknadModal({ id, tom, onClick }: { id: string; tom: string; onClick: () => void }): ReactElement {
    return (
        <Modal.Content className="p-6">
            <h2 id={id}>Søknad er ikke klar</h2>
            <p>
                Den ansatte får ikke fylle ut søknaden før sykefraværet er over:{' '}
                <b>{formatDate(getSoknadActivationDate(tom))}</b>
            </p>
            <p>Du blir varslet så fort søknaden er utfylt og sendt inn.</p>
            <div className="flex justify-center">
                <Button className="mt-4 min-w-[8rem]" variant="secondary" size="small" onClick={onClick}>
                    OK
                </Button>
            </div>
        </Modal.Content>
    )
}

export default SoknadModalContent
