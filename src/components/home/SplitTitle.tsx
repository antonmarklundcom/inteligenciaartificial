type Props = {
  as: "h1" | "h2";
  text: string;
  id?: string;
};

/**
 * Heading split into per-character spans for the letter-reveal animation.
 * Screen readers get the plain text; the animated spans are hidden from them.
 */
export function SplitTitle({ as: Tag, text, id }: Props) {
  let index = 0;
  const words = text.split(/\s+/);
  return (
    <Tag id={id}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span className="title-word">
              {Array.from(word).map((char, c) => (
                <span key={c} className="title-char" style={{ "--char-index": index++ } as React.CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
