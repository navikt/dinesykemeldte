import React from 'react';
import Head from 'next/head';
import { BodyLong, ContentContainer } from '@navikt/ds-react';
import { QueryClient } from 'react-query';

import { useSykmeldt } from '../../../hooks/useSykmeldt';
import SoknaderList from '../../../components/soknader/SoknaderList';
import { withAuthenticatedPage } from '../../../auth/withAuthentication';
import { GetServerSidePropsPrefetchResult } from '../../../shared/types';
import { prefetchQuery, wrapProps } from '../../../graphql/prefetching';
import { useMineSykmeldteQuery } from '../../../graphql/queries/react-query.generated';
import { formatNameSubjective } from '../../../utils/sykmeldtUtils';
import PageFallbackLoader from '../../../components/shared/pagefallbackloader/PageFallbackLoader';
import LoadingError from '../../../components/shared/errors/LoadingError';
import SideNavigation from '../../../components/sidenavigation/SideNavigation';

function Soknader(): JSX.Element {
    const { sykmeldtId, sykmeldt, isLoading, error } = useSykmeldt();

    return (
        <div>
            <Head>
                <title>Dine sykmeldte - nav.no</title>
            </Head>
            <SideNavigation sykmeldt={sykmeldt}>
                <ContentContainer>
                    <BodyLong>
                        Her finner du søknader som {formatNameSubjective(sykmeldt?.navn)} har sendt fra nav.no. Etter at
                        et sykefravær er slutt, vil du bare se sykmeldinger som ikke er eldre enn fire måneder.
                        Sykmeldingene kommer også i Altinn.
                    </BodyLong>
                    {isLoading && <PageFallbackLoader text="Laster søknader" />}
                    {sykmeldt && <SoknaderList sykmeldtId={sykmeldtId} sykmeldt={sykmeldt} />}
                    {error && <LoadingError errorMessage="Vi klarte ikke å laste søknadene." />}
                </ContentContainer>
            </SideNavigation>
        </div>
    );
}

export const getServerSideProps = withAuthenticatedPage(async (context): Promise<GetServerSidePropsPrefetchResult> => {
    const client = new QueryClient();

    await prefetchQuery({ client, context }, useMineSykmeldteQuery);

    return {
        props: wrapProps(client),
    };
});

export default Soknader;
