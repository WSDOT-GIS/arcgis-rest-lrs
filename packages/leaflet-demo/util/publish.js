// tslint:disable-next-line:no-var-requires
const ghpages = require("gh-pages");

ghpages.publish(
  ".",
  {
    src: ["*.{html,ico}", "{dist,leaflet,style,src}/**/*"]
  },
  (error) => {
    if (error) {
      console.error(error);
    }
  }
);
