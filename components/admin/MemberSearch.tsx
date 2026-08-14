"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Debounced search box that drives the `q` query param on /admin/users. */
export default function MemberSearch({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    if (value === initialQuery) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      // A new search always restarts at page 1; keeping the old offset would
      // show an empty page for a narrower result set.
      params.delete("page");
      router.push(`/admin/users?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, initialQuery, router, searchParams]);

  return (
    <div className="w-full sm:w-72">
      <label htmlFor="member-search" className="sr-only">
        Search members
      </label>
      <input
        id="member-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search name or email…"
        className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-2.5 text-[14px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600"
      />
    </div>
  );
}
