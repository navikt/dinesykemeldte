import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import useSelectedVirksomhet from '../../hooks/useSelectedSykmeldt'
import { filterSykmeldteByOrg } from '../sykmeldte/useFilteredSykmeldte'
import { MineSykmeldteDocument } from '../../graphql/queries/graphql.generated'

export function useIsMoreThan5SykmeldteInSelectedVirksomhet(): boolean {
    const router = useRouter()
    const initialVirksomhet = (router.query.bedrift as string | undefined) ?? null

    const { data } = useQuery(MineSykmeldteDocument)
    const selectedVirksomhet = useSelectedVirksomhet()

    if (!data?.mineSykmeldte?.length) return false

    return filterSykmeldteByOrg(initialVirksomhet ?? selectedVirksomhet, data.mineSykmeldte).length >= 5
}
