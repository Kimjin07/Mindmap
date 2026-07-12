import { NextResponse } from "next/server";
import { getCompany } from "../../../data/companies";

/**
 * 返回单个公司的完整数据(供地图抽屉按需拉取)。
 * 浏览器端只带 53KB 瘦版数据;完整 1.6MB 数据留在服务端,点开哪家才取哪家。
 */
export const revalidate = 300;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const c = getCompany(id);
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(c);
}
