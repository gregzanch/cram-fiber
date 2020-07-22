export interface ObjectProps {
  name: string;
  kind: string;
  visible: boolean;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number, string];
  uuid: string;
  color: number;
}