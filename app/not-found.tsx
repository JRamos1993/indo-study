import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-5 text-center">
      <div>
        <div className="font-display text-[80px] font-extrabold leading-none" style={{ color: "var(--accent)" }}>
          404
        </div>
        <h1 className="mt-2 text-[26px]">This page wandered off</h1>
        <p className="mt-2 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
          The link may be broken or the page may have moved.
        </p>
        <Link href="/today" className="btn btn-primary mt-6 inline-flex">
          Back to studying
        </Link>
      </div>
    </div>
  );
}
