import { Pages, SideMenu } from '@navikt/dinesykmeldte-sidemeny';
import Link from 'next/link';

import { PreviewSykmeldtFragment } from '../../graphql/queries/graphql.generated';

type Props = {
    sykmeldt: PreviewSykmeldtFragment | null;
    activePage: Pages;
};

function PageSideMenu({ sykmeldt, activePage }: Props): JSX.Element | null {
    if (!sykmeldt) return null;

    return (
        <SideMenu
            sykmeldtId={sykmeldt.narmestelederId}
            sykmeldtName={sykmeldt.navn}
            activePage={activePage}
            routes={{
                Sykmeldinger: {
                    // TODO: Notifications are disabled for all routes until eSyfo decides how they want to handle notifications
                    // notifications: sykmeldt.sykmeldinger.filter((it) => !it.lest).length,
                    notifications: 0,
                    internalRoute: ({ children, ...rest }) => (
                        <Link href={`/sykmeldt/${sykmeldt.narmestelederId}/sykmeldinger`} passHref>
                            <a {...rest}>{children}</a>
                        </Link>
                    ),
                },
                Soknader: {
                    // notifications: sykmeldt.previewSoknader.filter((it) => isPreviewSoknadNotification(it)).length,
                    notifications: 0,
                    internalRoute: ({ children, ...rest }) => (
                        <Link href={`/sykmeldt/${sykmeldt.narmestelederId}/soknader`} passHref>
                            <a {...rest}>{children}</a>
                        </Link>
                    ),
                },
                Meldinger: {
                    hide: sykmeldt.aktivitetsvarsler.length === 0,
                    // notifications: sykmeldt.aktivitetsvarsler.filter((it) => !it.lest).length,
                    notifications: 0,
                    internalRoute: ({ children, ...rest }) => (
                        <Link href={`/sykmeldt/${sykmeldt.narmestelederId}/meldinger`} passHref>
                            <a {...rest}>{children}</a>
                        </Link>
                    ),
                },
                // Dialogmoter: sykmeldt.dialogmoter.length,
                Dialogmoter: 0,
                // Oppfolgingsplaner: sykmeldt.oppfolgingsplaner.length,
                Oppfolgingsplaner: 0,
                DineSykmeldte: {
                    notifications: 0,
                    internalRoute: ({ children, ...rest }) => (
                        <Link href="/" passHref>
                            <a {...rest}>{children}</a>
                        </Link>
                    ),
                },
            }}
        />
    );
}

export default PageSideMenu;
