import { useSubscription } from '@apollo/client';
import { Card, CardContent, Typography } from '@mui/material';
import React, { FC } from 'react';
import { COMMENTS_SUBSCRIPTION } from '../../containers/Book/graphql';

const NewComment: FC<{bookId: number, onNewComment?: () => void}> = ({bookId, onNewComment}) => {
    const { data } = useSubscription(COMMENTS_SUBSCRIPTION, {
      variables: { bookId },
      onData: ({ data }) => {
        if (data.data && onNewComment) {
          onNewComment();
        }
      }
    });
  
    return (
      data?.commentAdded?.text && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography>
              Добавлен новый комментарий: {data.commentAdded.text}
            </Typography>
          </CardContent>
        </Card>
      )
    );
  };

  export default NewComment;