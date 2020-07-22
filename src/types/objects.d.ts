
import { Grid, Axes, AcousticSource } from '../components/Editor/Objects';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      grid: ReactThreeFiber.Object3DNode<Grid, typeof Grid>;
      axes: ReactThreeFiber.Object3DNode<Axes, typeof Axes>;
      acousticSource: ReactThreeFiber.Object3DNode<AcousticSource, typeof AcousticSource>;
    }
  }
}
export { };
