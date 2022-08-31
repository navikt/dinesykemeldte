import { Cell, Grid, Pagination, Select } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { PreviewSykmeldtFragment } from '../../graphql/queries/graphql.generated';
import ExpandableSykmeldtPanel from '../shared/SykmeldtPanel/ExpandableSykmeldtPanel';
import { RootState } from '../../state/store';
import paginationSlice, { PAGE_SIZE_KEY } from '../../state/paginationSlice';

import { useExpanded, useExpandSykmeldte } from './useExpandSykmeldte';
import styles from './PaginatedSykmeldteList.module.css';

type Props = {
    sykmeldte: PreviewSykmeldtFragment[];
    focusSykmeldtId: string | null;
};

function PaginatedSykmeldteList({ sykmeldte, focusSykmeldtId }: Props): JSX.Element {
    const { expandedSykmeldte, expandedSykmeldtPerioder } = useExpanded();
    const handleSykmeldtClick = useExpandSykmeldte(focusSykmeldtId, expandedSykmeldte);
    const page = useSelector((state: RootState) => state.pagination.page);
    const pageSize = useSelector((state: RootState) => state.pagination.pageSize);
    const shouldPaginate = sykmeldte.length > pageSize;
    const list = !shouldPaginate ? sykmeldte : chunkSykmeldte(sykmeldte, page, pageSize);
    const lastItemRef = useScrollLastItemIntoViewIfOutOfViewport(shouldPaginate);
    const focusSykmeldtIndex = sykmeldte.findIndex((it) => it.narmestelederId === focusSykmeldtId);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!focusSykmeldtId || focusSykmeldtIndex === -1) return;

        const focusPage = Math.floor(focusSykmeldtIndex / pageSize);

        requestAnimationFrame(() => {
            dispatch(paginationSlice.actions.setPage(focusPage));
        });
    }, [dispatch, focusSykmeldtId, focusSykmeldtIndex, pageSize]);

    return (
        <div>
            <section
                aria-label={`side ${page + 1} av sykmeldte`}
                className={cn({ [styles.paginatedSection]: shouldPaginate })}
            >
                <Grid>
                    {list.map((it, index) => (
                        <Cell
                            ref={index === list.length - 1 ? lastItemRef : undefined}
                            key={it.narmestelederId}
                            xs={12}
                        >
                            <ExpandableSykmeldtPanel
                                sykmeldt={it}
                                notification={false}
                                expanded={expandedSykmeldte.includes(it.narmestelederId)}
                                periodsExpanded={expandedSykmeldtPerioder.includes(it.narmestelederId)}
                                onClick={handleSykmeldtClick}
                                focusSykmeldtId={focusSykmeldtId}
                            />
                        </Cell>
                    ))}
                </Grid>
            </section>
            <PageSizeSelector />
            {shouldPaginate && <PaginationControls sykmeldte={sykmeldte} />}
        </div>
    );
}

function chunkSykmeldte(
    sykmeldte: PreviewSykmeldtFragment[],
    page: number,
    pageSize: number,
): PreviewSykmeldtFragment[] {
    return sykmeldte.slice(pageSize * page, pageSize * page + pageSize);
}

function useScrollLastItemIntoViewIfOutOfViewport(
    shouldPaginate: boolean,
): React.MutableRefObject<HTMLDivElement | null> {
    const page = useSelector((state: RootState) => state.pagination.page);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element: HTMLDivElement | null = lastItemRef.current;
        if (!shouldPaginate || element == null) return;

        const itemBoundingBox = element.getBoundingClientRect();
        if (itemBoundingBox.y < 128) {
            window.scrollTo({ top: window.scrollY + itemBoundingBox.top - 128, behavior: 'smooth' });
        }
    }, [page, shouldPaginate]);

    return lastItemRef;
}

function PaginationControls({ sykmeldte }: { sykmeldte: PreviewSykmeldtFragment[] }): JSX.Element {
    const dispatch = useDispatch();
    const page = useSelector((state: RootState) => state.pagination.page);
    const pageSize = useSelector((state: RootState) => state.pagination.pageSize);
    const pages = Math.ceil(sykmeldte.length / pageSize);

    return (
        <section className={styles.paginationControls} aria-label="navigering for paginering">
            <Pagination
                size="small"
                prevNextTexts
                page={page + 1}
                onPageChange={(pageNumber) => dispatch(paginationSlice.actions.setPage(pageNumber - 1))}
                count={pages}
            />
        </section>
    );
}

function PageSizeSelector(): JSX.Element {
    const dispatch = useDispatch();

    const pageSize = useSelector((state: RootState) => state.pagination.pageSize);

    return (
        <div className={styles.pageSizeWrapper}>
            <Select
                label="per side"
                size="small"
                className={styles.pageSizeSelect}
                value={pageSize}
                onChange={(e) => {
                    const value = +e.target.value;
                    dispatch(paginationSlice.actions.setPageSize(value));
                    localStorage.setItem(PAGE_SIZE_KEY, `${value}`);
                }}
            >
                <option>5</option>
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
            </Select>
        </div>
    );
}

export default PaginatedSykmeldteList;
