import { BodyShort } from '@navikt/ds-react';

import Alert from '../../../../shared/Alert/Alert';
import { SykmeldingFragment } from '../../../../../graphql/queries/react-query.generated';
import { notNull } from '../../../../../utils/tsUtils';
import SykmeldingerPerioderTable from '../SykmeldingerPerioderTable/SykmeldingerPerioderTable';

function SummaryContent({ sykmeldinger }: { sykmeldinger: (SykmeldingFragment | null)[] }): JSX.Element {
    const failedCount = sykmeldinger.filter((it) => !notNull(it)).length;
    return (
        <div>
            <BodyShort>Oversikten viser sykmeldingsperioder for inntil 4 måneder tilbake i tid.</BodyShort>
            {failedCount > 0 && (
                <Alert variant="error" id={`sykmelding-summary-error-${sykmeldinger[0]?.id}`}>
                    Klarte ikke å hente {failedCount} av {sykmeldinger?.length} sykmeldinger
                </Alert>
            )}
            <SykmeldingerPerioderTable perioder={sykmeldinger?.flatMap((it) => it?.perioder).filter(notNull)} />
        </div>
    );
}

export default SummaryContent;
