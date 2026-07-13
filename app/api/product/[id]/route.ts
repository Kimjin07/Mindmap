import { NextResponse } from "next/server";
import deepData from "../../../data/deep.json";
import type { DeepSection } from "../../../data/players";

/**
 * 项目深度讲解(知识卡片)按需下发:内容量大,保存在服务端 deep.json,
 * 打开项目详情窗口时才拉取,避免打进浏览器 JS 包。
 */
export const revalidate = 300;

const DEEP = deepData as unknown as Record<string, DeepSection[]>;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  return NextResponse.json({ deep: DEEP[id] ?? null });
}
