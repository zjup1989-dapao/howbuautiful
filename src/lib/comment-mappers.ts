export type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  profiles?: { display_name?: string | null } | null;
};

export type DisplayComment = {
  id: string;
  body: string;
  createdAt: string;
  author: string;
};

export function mapCommentRow(row: CommentRow): DisplayComment {
  return {
    id: row.id,
    body: row.body,
    createdAt: row.created_at,
    author: row.profiles?.display_name || "匿名用户",
  };
}

export const demoComments: DisplayComment[] = [
  {
    id: "demo-1",
    author: "Nora",
    body: "颜色很提气，西装的廓形也不会太正式。",
    createdAt: new Date("2026-06-06T10:00:00.000Z").toISOString(),
  },
  {
    id: "demo-2",
    author: "Kai",
    body: "这套的亮点是上半身，鞋子保持低调很聪明。",
    createdAt: new Date("2026-06-06T10:10:00.000Z").toISOString(),
  },
];
