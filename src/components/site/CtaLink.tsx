import Link from "next/link";
import type { Contact } from "@/lib/site";

type Props = { contact: Contact; className?: string; label?: string };

/** The primary call to action: WhatsApp in a new tab, or the contact page. */
export function CtaLink({ contact, className = "pill", label }: Props) {
  if (contact.external) {
    return (
      <a className={className} href={contact.href} target="_blank" rel="noopener noreferrer">
        {label ?? contact.label}
      </a>
    );
  }
  return (
    <Link className={className} href={contact.href}>
      {label ?? contact.label}
    </Link>
  );
}
