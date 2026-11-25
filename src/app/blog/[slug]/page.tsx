import { PostPage, postMetadata } from "@/components/site/PostPages";
import { getPosts } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getPosts("guias").map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props) {
  return postMetadata("guias", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <PostPage collection="guias" slug={(await params).slug} />;
}
