import { BrowserRouter } from 'react-router-dom';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    NormalizedCacheObject,
    split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from '@apollo/client/link/ws'

import { OperationDefinitionNode } from 'graphql';
import routes from './route.tsx';

// Создать экземпляр InMemoryCache
const cache = new InMemoryCache();

// Создайте HTTP-ссылку для запросов и мутаций
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/', // Замените на ваш GraphQL HTTP URL
});

const wsLink = new WebSocketLink(
    new SubscriptionClient('ws://localhost:4000/graphql', {
        reconnect: true,
    }));

// Создайте WebSocket клиент, используя graphql-ws
// TODO: когда сервер обновится до graphql-ws, используйте следующий код
// const wsLink = new GraphQLWsLink(
//     createClient({
//         url: 'ws://localhost:4000/graphql', // Замените на ваш WebSocket URL
//         connectionParams: {
//             reconnect: true,
//         },
//     })
// );

// Используйте split, чтобы определить, использовать ли ссылку WebSocket или ссылку HTTP.
const link = split(
    // Разделить по типу операции (подписка или другая)
    ({ query }) => {
        const definition = getMainDefinition(query) as OperationDefinitionNode;
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
);

// Создайте экземпляр Apollo Client
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link,
    headers: {
        authorization: localStorage.getItem('token') || '',
        'client-name': 'Books Explorer [web]',
        'client-version': '1.0.0',
    },
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>{routes}</BrowserRouter>
        </ApolloProvider>
    );
};

export default App;