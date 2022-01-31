import { ApolloServer, AuthenticationError } from 'apollo-server-micro';
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

import schema from '../../graphql/schema';
import { createResolverContextType, withAuthenticatedApi } from '../../auth/withAuthentication';
import { logger } from '../../utils/logger';
import { ResolverContextType } from '../../graphql/resolvers/resolverTypes';

const apolloServer = new ApolloServer({
    schema,
    context: async ({ req }): Promise<ResolverContextType> => {
        const resolverContextType = createResolverContextType(req);

        if (!resolverContextType) {
            throw new AuthenticationError('User not logged in');
        }

        return resolverContextType;
    },
    plugins: [
        process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageDisabled()
            : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    logger,
});

export const config = {
    api: { bodyParser: false },
};

const startServer = apolloServer.start();
export default withAuthenticatedApi(async (req, res) => {
    await startServer;
    await apolloServer.createHandler({
        path: '/api/graphql',
    })(
        // @ts-expect-error Incompatible type in apollo-server-micro with NextRequest
        req,
        res,
    );
});
