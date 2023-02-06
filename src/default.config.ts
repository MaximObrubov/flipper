import { FlipperOptionsInterface } from "./types/options";

const options: FlipperOptionsInterface = {
  pages: [],
  direction: "left",
  fill: "both",
  time: 1200,
  spread: false,
  adaptive: false,
  perspective: 4000,
  singleFilledOffset: 40,
  page: {
    width: 300,
    height: 300,
    shadow: true,
    hover: true,
    offset: [0, 0]
  }
};

export default options;
