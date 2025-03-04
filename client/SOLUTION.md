# Решение задачи

## ЧАСТЬ 1: уведомление о новом комментарии

1. Добавьте подписку в хук `useQuery`:

```ts
export const COMMENTS_SUBSCRIPTION = gql`
 subscription OnCommentAdded($bookId: ID!) {
  commentAdded(bookId: $bookId) {
    text
  }
 }
`;
```

2. Добавьте компонент для отображения уведомления о добавленном комментарии: 

```ts
const NewComment: FC<{bookId: number }> =
    ({bookId}) => {
  const { data } = useSubscription(COMMENTS_SUBSCRIPTION,
        { variables: { bookId } }
  );

  return (
      data?.commentAdded?.text && <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>
              Добавлен новый комментарий: {data?.commentAdded?.text}
          </Typography>
        </CardContent>
      </Card>
  );
};
```

3. Вставьте компонент в BookComponent:

```jsx
<NewComment bookId={bookId} onNewComment={refetch} />
<Typography>Comments number: {totalComments}</Typography>
```


## ЧАСТЬ 2: автоматическое обновление списка комментариев при добавлении нового комментария


1. Извлеките функцию refetch при загрузке книги по её ID в BookComponent:

```ts
  const { data, error, refetch } = useQuery<getBook>(GET_BOOK_BY_ID, {
    variables: { id: bookId },
  });
```

Это позволит перезагрузить данные книги при добавлении нового комментария.

2. Обновите компонент в BookComponent, передав функцию refetch в NewComment:

```jsx
<NewComment bookId={bookId} onNewComment={refetch} />
<Typography>Comments number: {totalComments}</Typography>
```

3. Обновите компонент NewComment, чтобы вызывать функцию onNewComment:


```ts
const NewComment: FC<{bookId: number, onNewComment: ()=>void }> =
    ({bookId, onNewComment}) => {
  const { data } = useSubscription(COMMENTS_SUBSCRIPTION,
        { variables: { bookId } }
  );
  onNewComment();

  return (
      data?.commentAdded?.text && <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>
              Добавлен новый комментарий: {data?.commentAdded?.text}
          </Typography>
        </CardContent>
      </Card>
  );
};
```

Теперь BookComponent автоматически будет перезагружать данные книги при добавлении нового комментария.
