import Head from 'next/head';
import { BodyLong, ContentContainer } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';
import { QueryClient } from 'react-query';

import { logger } from '../../../utils/logger';
import { GetServerSidePropsPrefetchResult } from '../../../shared/types';
import { wrapProps } from '../../../graphql/prefetching';
import SykmeldingerList from '../../../components/sykmeldinger/SykmeldingerList';
import { withAuthenticatedPage } from '../../../auth/withAuthantication';
import { getPublicEnv } from '../../../utils/env';

const publicConfig = getPublicEnv();

function Sykmeldt(): JSX.Element {
    useEffect(() => {
        setBreadcrumbs([
            { title: 'Dine sykmeldte', url: publicConfig.publicPath || '/' },
            { title: 'This person', url: location.pathname },
        ]).catch(() => {
            logger.error('klarte ikke å oppdatere breadcrumbs');
        });
    });

    return (
        <div>
            <Head>
                <title>Dine sykmeldte - nav.no</title>
            </Head>
            <ContentContainer>
                <BodyLong>
                    Her finner du sykmeldinger som Lisa Mortensen har sendt fra nav.no. Etter at et sykefravær er slutt,
                    vil du bare se sykmeldinger som ikke er eldre enn fire måneder. Sykmeldingene kommer også i Altinn.
                </BodyLong>
                <SykmeldingerList />
            </ContentContainer>
        </div>
    );
}

export const getServerSideProps = withAuthenticatedPage(async (): Promise<GetServerSidePropsPrefetchResult> => {
    const queryClient = new QueryClient();

    // await queryPrefetcher(queryClient, useDineSykmeldteQuery, {});

    return {
        props: wrapProps(queryClient),
    };
});

export default Sykmeldt;
