import React, { ReactElement } from 'react'
import {
    BandageFillIcon,
    BellFillIcon,
    CalendarIcon,
    PersonGroupIcon,
    Chat2Icon,
    FileSearchIcon,
    PersonIcon,
    HourglassIcon,
    CheckmarkCircleFillIcon,
    TasklistFillIcon,
} from '@navikt/aksel-icons'
import { logger } from '@navikt/next-logger'

export type Icons =
    | 'Dialog'
    | 'CoApplicant'
    | 'Findout'
    | 'Calendar'
    | 'Sandglass'
    | 'BellFilled'
    | 'TaskFilled'
    | 'SuccessFilled'
    | 'BandageFilled'

interface Props {
    className?: string
    icon: Icons
}

const TimelineIcon = ({ className, icon }: Props): ReactElement => {
    const Icon = iconToComponent(icon)
    return <Icon className={className} role="img" aria-hidden />
}

function iconToComponent(icon: Icons): typeof Chat2Icon {
    switch (icon) {
        case 'Dialog':
            return Chat2Icon
        case 'CoApplicant':
            return PersonGroupIcon
        case 'Findout':
            return FileSearchIcon
        case 'Calendar':
            return CalendarIcon
        case 'Sandglass':
            return HourglassIcon
        case 'BandageFilled':
            return BandageFillIcon
        case 'BellFilled':
            return BellFillIcon
        case 'TaskFilled':
            return TasklistFillIcon
        case 'SuccessFilled':
            return CheckmarkCircleFillIcon
        default:
            logger.error(`Unknown icon: "${icon}"`)
            return PersonIcon
    }
}

export default TimelineIcon
