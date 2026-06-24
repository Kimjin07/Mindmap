import { notFound } from "next/navigation";
import SketchDefs from "../../components/SketchDefs";
import Atlas from "../../components/Atlas";
import { getNode } from "../../data/nodes";

const LAYERS = ["apps", "models", "infra", "chips", "energy", "space", "optical"];

export function generateStaticParams() {
  return LAYERS.map((layer) => ({ layer }));
}

export default async function LayerMap({
  params,
}: {
  params: Promise<{ layer: string }>;
}) {
  const { layer } = await params;
  const node = getNode(layer);
  if (!node || node.type !== "layer") notFound();

  // 同一张世界地图，初始镜头定位到该板块（具体城市由 URL #锚点决定）。
  return (
    <main className="atlas-page">
      <SketchDefs />
      <Atlas focusLayer={layer} />
    </main>
  );
}
