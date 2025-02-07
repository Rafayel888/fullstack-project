import express, { Request, Response } from 'express';

const app = express();
const port = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to the product dashboard!!!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
