export const PAGE_SIZE = 50;

export function parsePage(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
};

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const clamped = Math.min(Math.max(1, page), totalPages);
  const start = (clamped - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: clamped,
    pageSize,
    totalPages,
    total: items.length,
  };
}
