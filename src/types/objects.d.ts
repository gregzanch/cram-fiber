
import { Grid, Axes } from '../components/Editor/Objects';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      grid: ReactThreeFiber.Object3DNode<Grid, typeof Grid>;
      axes: ReactThreeFiber.Object3DNode<Axes, typeof Axes>;
    }
  }
}
export { };
