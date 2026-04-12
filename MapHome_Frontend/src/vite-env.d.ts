/// <reference types="vite/client" />

// Declare CSS modules from third-party libraries
declare module "slick-carousel/slick/slick.css" {
  const content: string;
  export default content;
}

declare module "slick-carousel/slick/slick-theme.css" {
  const content: string;
  export default content;
}


declare module "./styles/index.css" {
  const content: string;
  export default content;
}
