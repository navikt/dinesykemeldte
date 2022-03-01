import { logger } from '../../utils/logger';

export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
    return async (): Promise<TData> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/graphql` as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        });

        switch (res.status) {
            case 403:
                location.replace(
                    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/oauth2/login?redirect=${location.pathname}`,
                );
                throw new Error(`Du har blitt logget ut`);
        }

        let json;
        try {
            json = await res.json();
        } catch (e) {
            logger.error(`Unknown error, API responded with: ${res.status} ${res.statusText}`);
            throw new Error('Ukjent feil');
        }

        if (json.errors) {
            const { message } = json.errors[0];

            throw new Error(message);
        }

        return json.data;
    };
}
