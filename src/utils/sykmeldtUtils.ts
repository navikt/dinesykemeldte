import { PreviewSykmeldtFragment } from '../graphql/queries/react-query.generated';

export function formatNamePossessive(sykmeldt: PreviewSykmeldtFragment | null, postfix: string) {
    if (sykmeldt?.navn) {
        return `${sykmeldt.navn}s ${postfix}`;
    } else {
        return `Sykmeldtes ${postfix}`;
    }
}

export function formatNameSubjective(navn: string | null | undefined) {
    if (navn) {
        return `${navn}`;
    } else {
        return `den sykmeldte`;
    }
}

export function sortByDate(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    // TODO sikkert en annen dato
    return a.startdatoSykefravar.localeCompare(b.startdatoSykefravar);
}

export function sortByName(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    return a.navn.localeCompare(b.navn);
}
