import React, { ReactElement, PropsWithChildren } from 'react'
import { ExpansionCard } from '@navikt/ds-react'

import { cleanId } from '../../../utils/stringUtils'

import TimelineIcon, { Icons } from './TimelineIcon'
import styles from './ExpandableInfo.module.css'

interface Props {
    title: string
    icon: Icons
}

const ExpandableInfo = ({ children, title, icon }: PropsWithChildren<Props>): ReactElement => {
    const titleId = cleanId(title)
    return (
        <div className={styles.accordionTimelineRoot}>
            <div className={styles.accordionTimelineLine} />
            <div className={styles.accordionTimelineDot} />
            <div className={styles.accordionTimelineWrapper}>
                <ExpansionCard size="small" style={{ marginBottom: '32px' }} aria-labelledby={titleId}>
                    <ExpansionCard.Header>
                        <div className={styles.headerContent}>
                            <TimelineIcon icon={icon} />
                            <ExpansionCard.Title id={titleId}>{title}</ExpansionCard.Title>
                        </div>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content className={styles.accordionContent}>{children}</ExpansionCard.Content>
                </ExpansionCard>
            </div>
        </div>
    )
}

export default ExpandableInfo
