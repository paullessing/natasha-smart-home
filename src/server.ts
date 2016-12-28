import "reflect-metadata"; // Required for inversify

import {app} from './app';

app.listen(7654, () => {
  console.log('Server started');
});
