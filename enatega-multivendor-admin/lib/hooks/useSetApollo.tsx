// Imports for Apollo Client setup and configuration
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation,
  split,
} from '@apollo/client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// GraphQL related imports
import { DefinitionNode } from 'graphql';
import { WebSocketLink } from '@apollo/client/link/ws';

// Utility imports
import { Subscription } from 'zen-observable-ts';
import { APP_NAME } from '../utils/constants';

export const useSetupApollo = (): ApolloClient<NormalizedCacheObject> => {
  const { SERVER_URL, WS_SERVER_URL } = useConfiguration();

  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: `${SERVER_URL}graphql`,
  });

  const wsLink = new WebSocketLink(
    new SubscriptionClient(`${WS_SERVER_URL}graphql`, {
      reconnect: true,
    })
  );

  const request = async (operation: Operation): Promise<void> => {
    const data = localStorage.getItem(`user-${APP_NAME}`);

    let token = '';
    if (data) {
      token = JSON.parse(data).token;
    }

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  };

  // Request Link
  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: Subscription | undefined;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  // Terminating Link
  const terminatingLink = split(({ query }) => {
    const definition = getMainDefinition(query) as DefinitionNode & {
      kind: string;
      operation?: string;
    };
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  }, wsLink);

  const client = new ApolloClient({
    link: concat(ApolloLink.from([terminatingLink, requestLink]), httpLink),
    cache,
    connectToDevTools: true,
  });

  return client;
};
