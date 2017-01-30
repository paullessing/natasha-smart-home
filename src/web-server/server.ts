import "reflect-metadata"; // Required for inversify

import {app} from './app';

const port = 8081;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});