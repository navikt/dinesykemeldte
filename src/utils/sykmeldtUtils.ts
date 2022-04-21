import { compareDesc } from 'date-fns';

import { PreviewSykmeldtFragment } from '../graphql/queries/graphql.generated';

import { isPreviewSoknadNotification } from './soknadUtils';
import { toDate } from './dateUtils';
import { toLatestTom } from './sykmeldingPeriodUtils';

export function formatNamePossessive(navn: string | null | undefined, postfix: string): string {
    if (navn) {
        return `${navn}s ${postfix}`;
    } else {
        return `Sykmeldtes ${postfix}`;
    }
}

export function formatFirstNamePossessive(name: string, postfix: string): string {
    return `${name.split(' ')[0]}s ${postfix}`;
}

export function formatNameSubjective(navn: string | null | undefined): string {
    if (navn) {
        return `${navn}`;
    } else {
        return `Den sykmeldte`;
    }
}

export function sortByDate(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    const latestA = a.sykmeldinger.flatMap((it) => it.perioder).reduce(toLatestTom);
    const latestB = b.sykmeldinger.flatMap((it) => it.perioder).reduce(toLatestTom);

    return compareDesc(toDate(latestA.tom), toDate(latestB.tom));
}

export function sortByName(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    return a.navn.localeCompare(b.navn);
}

export function notificationCount(sykmeldt: PreviewSykmeldtFragment): number {
    const sykmeldinger = sykmeldt.sykmeldinger.filter((it) => !it.lest).length;
    const soknader = sykmeldt.previewSoknader.filter((it) => isPreviewSoknadNotification(it)).length;
    const aktivitetsplaner = sykmeldt.aktivitetsvarsler.filter((it) => !it.lest).length;
    const dialogmoter = sykmeldt.dialogmoter.length;
    const oppfolgingsplaner = sykmeldt.oppfolgingsplaner.length;

    return sykmeldinger + soknader + dialogmoter + oppfolgingsplaner + aktivitetsplaner;
}
