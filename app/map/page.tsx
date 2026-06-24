import SketchDefs from "../components/SketchDefs";
import Atlas from "../components/Atlas";

// /map —— 不指定板块，进来直接看整张世界地图全貌。
export default function WorldMap() {
  return (
    <main className="atlas-page">
      <SketchDefs />
      <Atlas />
    </main>
  );
}
