import { compareDesc, differenceInDays } from 'date-fns'
import * as R from 'remeda'

import {
    AktivitetsvarselFragment,
    PreviewSykmeldtFragment,
    SykmeldingFragment,
} from '../graphql/queries/graphql.generated'

import { isPreviewSoknadNotifying } from './soknadUtils'
import { toDate } from './dateUtils'
import { toLatestTom } from './sykmeldingPeriodUtils'

function appendPossesive(navn: string): string {
    return navn.endsWith('s') || navn.endsWith('x') ? `${navn}'` : `${navn}s`
}

export function formatNamePossessive(navn: string | null | undefined, postfix: string): string {
    if (navn) {
        return `${appendPossesive(navn)} ${postfix}`
    } else {
        return `Sykmeldtes ${postfix}`
    }
}

export function formatFirstNamePossessive(name: string, postfix: string): string {
    return `${appendPossesive(name.split(' ')[0])} ${postfix}`
}

export function formatNameSubjective(navn: string | null | undefined): string {
    if (navn) {
        return `${navn}`
    } else {
        return `Den sykmeldte`
    }
}

export function sortByDate(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    const latestA = a.sykmeldinger.flatMap((it) => it.perioder).reduce(toLatestTom)
    const latestB = b.sykmeldinger.flatMap((it) => it.perioder).reduce(toLatestTom)

    return compareDesc(toDate(latestA.tom), toDate(latestB.tom))
}

export function sortByName(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    return a.navn.localeCompare(b.navn, 'no')
}

export function sortByOrgName(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    return a.orgnavn.localeCompare(b.orgnavn, 'no')
}

export const isSykmeldingNotifying = (it: SykmeldingFragment): boolean => !it.lest
export const isAktivitetsvarselNotifying = (it: AktivitetsvarselFragment): boolean => !it.lest

export function notificationCount(sykmeldt: PreviewSykmeldtFragment): number {
    const sykmeldinger = sykmeldt.sykmeldinger.filter(isSykmeldingNotifying).length
    const soknader = sykmeldt.previewSoknader.filter(isPreviewSoknadNotifying).length
    const aktivitetsplaner = sykmeldt.aktivitetsvarsler.filter(isAktivitetsvarselNotifying).length
    const dialogmoter = sykmeldt.dialogmoter.length
    const oppfolgingsplaner = sykmeldt.oppfolgingsplaner.length

    return sykmeldinger + soknader + dialogmoter + oppfolgingsplaner + aktivitetsplaner
}

/**
 * Checks if the given sykmeldt has been sykmeldt for 6 weeks without 16 days of opphold
 */
export function hasBeenSykmeldt6WeeksWithout16DaysOpphold(sykmeldt: PreviewSykmeldtFragment): boolean {
    type DateRange = { fom: Date; tom: Date }

    const [firstPeriode, ...perioderTail]: DateRange[] = R.pipe(
        sykmeldt.sykmeldinger,
        R.flatMap((it) => it.perioder),
        R.map((it) => ({ fom: toDate(it.fom), tom: toDate(it.tom) })),
        R.sortBy((it) => it.fom),
    )
    const firstPeriodeTuple: [Date, number] = [firstPeriode.tom, differenceInDays(firstPeriode.tom, firstPeriode.fom)]
    const [, longestPeriodWithLessThan16Days] = R.pipe(
        perioderTail,
        R.reduce((prev, it) => {
            const [prevTom, days] = prev
            const thisPeriodDays = differenceInDays(it.tom, it.fom) + 1
            if (differenceInDays(it.fom, prevTom) - 1 > 16) {
                return [it.tom, thisPeriodDays] as [Date, number]
            } else {
                return [it.tom, days + thisPeriodDays] as [Date, number]
            }
        }, firstPeriodeTuple),
    )

    return longestPeriodWithLessThan16Days >= 7 * 6
}

export function fnrText(fnr: string, withLabel: boolean = true): string {
    const fnrSplitted = `${fnr.substring(0, 6)} ${fnr.substring(6)}`
    return withLabel ? `Fødselsnummer: ${fnrSplitted}` : fnrSplitted
}
