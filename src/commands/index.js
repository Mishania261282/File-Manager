import * as navigation from "./navigation.js";
// import * as fileOps from './fileOperations.js';
// import * as osInfo from './osInfo.js';
// import * as hash from './hash.js';
// import * as compression from './compression.js';

// Объединяем все команды в один объект
const Commands = {
  ...navigation,
  //   ...fileOps,
  //   ...osInfo,
  //   ...hash,
  //   ...compression,
};

export default Commands;
