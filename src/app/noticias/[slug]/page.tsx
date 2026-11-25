import { PostPage, postMetadata } from "@/components/site/PostPages";
import { getPosts } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getPosts("noticias").map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props) {
  return postMetadata("noticias", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <PostPage collection="noticias" slug={(await params).slug} />;
}
