import Link from "next/link";
import { COLLECTIONS, formatDate, type Post } from "@/lib/content";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="card">
      <p className="meta">
        <b>{COLLECTIONS[post.collection].label}</b>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>
      <h3>
        <Link href={post.url}>{post.title}</Link>
      </h3>
      <p>{post.description}</p>
      <span className="more">Leer · {post.minutes} min →</span>
    </article>
  );
}
