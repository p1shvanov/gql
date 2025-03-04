import { FC } from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'; // Updated MUI imports
import { format } from 'date-fns'; // Use date-fns for date formatting
import image from '../../assets/images/photo.png';
import { getBook_getBook_author } from '../../containers/Book/__generated__/getBook';

interface BookCardComponentProps {
  title: string;
  description: string;
  date: Date;
  author: getBook_getBook_author;
}

const BookCardComponent: FC<BookCardComponentProps> = ({ title, description, date, author }) => (
    <Card sx={{ maxWidth: 345, mb: 2 }}> {/* Updated Card styling with sx prop */}
      <CardActionArea>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <img src={image} alt="Book" style={{ maxWidth: '100%', maxHeight: 150 }} /> {/* Inline styling for image */}
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {`${author.lastname} ${author.firstname}`}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Date: {format(new Date(date), 'MM.dd.yyyy')} {/* Using date-fns for formatting */}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
);

export default BookCardComponent;