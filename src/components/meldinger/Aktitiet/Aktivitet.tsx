import React from 'react'
import { BodyLong, BodyShort, Heading, Label } from '@navikt/ds-react'
import Image from 'next/legacy/image'

import { browserEnv } from '../../../utils/env'
import { logAmplitudeEvent } from '../../../amplitude/amplitude'

import aktivitetsvarsel from './aktivitetsvarsel.svg'

const BASE_PATH = browserEnv.publicPath ?? ''

interface Props {
    sykmeldtId: string
}

function Aktivitet({ sykmeldtId }: Props): JSX.Element {
    return (
        <>
            <Heading size="medium" spacing>
                Påminnelse om aktivitet
            </Heading>
            <BodyLong spacing>
                Arbeidstakeren din har snart vært sykmeldt i åtte uker. NAV skal vurdere om den sykmeldte oppfyller
                aktivitetsplikten og fortsatt har rett til sykepenger.
            </BodyLong>
            <div className="mb-4">
                <Image src={aktivitetsvarsel} alt="arbeidsgiver og arbeidsdaker med en kaffekopp og et dokument" />
            </div>
            <Label>Den sykmeldtes aktivitetsplikt</Label>
            <BodyLong spacing>
                Alle sykmeldte har en plikt til å være i aktivitet hvis det er mulig. Aktivitet vil si å jobbe noe i
                kombinasjon med å være sykmeldt. Et eksempel er å jobbe 50 prosent og være 50 prosent sykmeldt.
            </BodyLong>
            <Label>Arbeidsgiverens tilretteleggingsplikt</Label>
            <BodyLong spacing>
                Aktivitetsplikten henger nært sammen med arbeidsgiverens muligheter for å tilrettelegge arbeidet. Som
                arbeidsgiver har du plikt til å tilrettelegge arbeidet så langt det er mulig, og bidra til løsninger som
                hindrer unødig sykefravær.
            </BodyLong>

            <Label>Hva må du gjøre nå?</Label>
            <BodyLong spacing>
                Det er viktig at du har god dialog med arbeidstakeren om det er mulig å utføre noen av arbeidsoppgavene
                til tross for sykdom. Det kommer an på hva sykdommen tillater og hva det er praktisk mulig å få til på
                arbeidsplassen. Sammen skal dere lage en oppfølgingsplan som beskriver arbeidsoppgavene og hva som skal
                til for å gjøre noen av dem.
            </BodyLong>

            <BodyLong spacing>
                Hvis det ikke er mulig å legge til rette på arbeidsplassen, må du dokumentere dette i oppfølgingsplanen
                og sende den til NAV.
            </BodyLong>

            <ul className="mb-8 pl-8">
                <li className="mb-2 list-disc text-blue-500 underline">
                    <a href={`${BASE_PATH}/oppfolgingsplaner/${sykmeldtId}`} target="_blank" rel="noopener noreferrer">
                        Lag en digital oppfølgingsplan nå
                    </a>
                </li>
                <li className="mb-2">eller</li>
                <li className="mb-2 list-disc text-blue-500 underline">
                    <a
                        href="https://www.nav.no/soknader/nb/bedrift/sykepenger/oppfolgingsplan"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Send en oppfølgingsplan til NAV i posten
                    </a>
                </li>
            </ul>

            <Label>NAVs vurdering</Label>
            <BodyLong>
                NAVs oppgave er å vurdere om aktivitetsplikten er oppfylt. Vurderingen baserer seg på opplysninger fra
                arbeidsgiveren og fra den som har sykmeldt arbeidstakeren. Utfallet av vurderingen kan være:
            </BodyLong>

            <ol className="list-latin pl-8">
                <BodyShort className="my-8" as="li">
                    Aktivitetsplikten er oppfylt fordi arbeidstakeren er delvis tilbake i arbeid. Utbetalingen av
                    sykepenger fortsetter.
                </BodyShort>
                <BodyShort className="my-8" as="li">
                    Det gis unntak fra aktivitetsplikten på grunn av helsesituasjonen eller fordi det ikke er mulig å
                    tilrettelegge på arbeidsplassen. Utbetalingen av sykepenger fortsetter.
                </BodyShort>
                <BodyShort className="my-8" as="li">
                    Aktivitetsplikten er ikke oppfylt. Den sykmeldte kan miste retten til sykepenger, og utbetalingen
                    stanses.
                </BodyShort>
            </ol>

            <video
                width="100%"
                height="auto"
                controls
                poster={`${browserEnv.cdnPublicPath}/videos/aktivitetsplikt.jpg`}
                crossOrigin="anonymous"
                onPlay={() => {
                    logAmplitudeEvent({
                        eventName: 'video start',
                        data: { video: 'Aktivitetsplikt' },
                    })
                }}
                onPause={() => {
                    logAmplitudeEvent({
                        eventName: 'video stopp',
                        data: { video: 'Aktivitetsplikt' },
                    })
                }}
            >
                <source src={`${BASE_PATH}/videos/aktivitetsplikt.mp4`} type="video/mp4" />
                <track
                    label="Norsk bokmål"
                    kind="captions"
                    srcLang="nb_no"
                    src={`${browserEnv.cdnPublicPath}/videos/aktivitetsplikt-nb.vtt`}
                    default
                />
                <p>
                    Nettleseren din støtter ikke denne videoavspillingen.{' '}
                    <a href={`${browserEnv.cdnPublicPath}/videos/aktivitetsplikt.mp4`}>Gå direkte til videoklippet</a>
                </p>
            </video>
        </>
    )
}

export default Aktivitet
