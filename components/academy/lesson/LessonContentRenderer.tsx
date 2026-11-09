import React from "react";
import {
  Callout,
  ExerciseBlock,
  KeyConceptChip,
  KeyConceptsBlock,
  ObjectiveItem,
  ObjectivesBlock,
  ReviewQuestionsBlock,
  Section,
  TakeawayItem,
  TakeawaysBlock,
} from "./LessonSections";

function stripMd(s: string) {
  return s
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();
}

export function parseContent(content: string) {
  if (!content) return [];
  const lines = content.split("\n");
  const blocks: any[] = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) {
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      i++;
      continue; // skip main title, header already shows it
    }
    if (line === "## LEARNING OBJECTIVES") {
      i++;
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(stripMd(lines[i].trim().replace(/^- /, "")));
        i++;
      }
      blocks.push({ type: "objectives", items });
      continue;
    }
    if (line === "## KEY CONCEPTS & TERMS") {
      i++;
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(stripMd(lines[i].trim().replace(/^- /, "")));
        i++;
      }
      blocks.push({ type: "concepts", items });
      continue;
    }
    if (line === "## YOUR TURN") {
      i++;
      const items: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("## ")) {
        const l = lines[i].trim();
        if (l && /^\d+\./.test(l)) {
          items.push(stripMd(l.replace(/^\d+\.\s*/, "")));
        } else if (l) {
          items.push(stripMd(l));
        }
        i++;
      }
      blocks.push({ type: "exercise", items });
      continue;
    }
    if (line === "## REVIEW QUESTIONS") {
      i++;
      const items: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("## ")) {
        const l = lines[i].trim();
        if (l && /^\d+\./.test(l)) {
          items.push(stripMd(l.replace(/^\d+\.\s*/, "")));
        }
        i++;
      }
      blocks.push({ type: "review", items });
      continue;
    }
    if (line === "## KEY TAKEAWAYS") {
      i++;
      const items: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("## ")) {
        const l = lines[i].trim();
        if (l && l.startsWith("- ")) {
          items.push(stripMd(l.replace(/^- /, "")));
        }
        i++;
      }
      blocks.push({ type: "takeaways", items });
      continue;
    }
    if (line === "## LESSON SUMMARY") {
      i++;
      let text = "";
      while (i < lines.length && !lines[i].trim().startsWith("## ") && !lines[i].trim().startsWith("**Estimated")) {
        const l = lines[i].trim();
        if (l) text += l + " ";
        i++;
      }
      blocks.push({ type: "summary", text: stripMd(text) });
      // skip duration/disclaimer for separate handling
      while (i < lines.length && (lines[i].trim().startsWith("**Estimated") || lines[i].trim().startsWith("Educational") || lines[i].trim().startsWith("*Educational"))) {
        i++;
      }
      continue;
    }
    if (line.startsWith("## ")) {
      const title = stripMd(line.replace(/^## /, ""));
      i++;
      let text = "";
      while (i < lines.length && !lines[i].trim().startsWith("## ")) {
        const l = lines[i];
        if (l.trim().startsWith("### ")) {
          // skip subheadings, they'll be part of text
          text += "\n\n" + stripMd(l.trim().replace(/^### /, "")) + "\n\n";
        } else if (l.trim()) {
          text += l.trim() + "\n\n";
        }
        i++;
      }
      // check if it's a callout
      if (title.toUpperCase().includes("INSIGHT")) {
        blocks.push({ type: "callout", kind: "insight", title: "HFT Insight", text: stripMd(text) });
      } else if (title.toUpperCase().includes("RISK NOTE")) {
        blocks.push({ type: "callout", kind: "risk", title: "Risk Note", text: stripMd(text) });
      } else if (title.toUpperCase().includes("TRADING EXAMPLE")) {
        blocks.push({ type: "callout", kind: "example", title: "Trading Example", text: stripMd(text) });
      } else {
        blocks.push({ type: "section", title, text: stripMd(text) });
      }
      continue;
    }
    if (line.startsWith("### ")) {
      // treat as part of section
      i++;
      continue;
    }
    // Preserve ordinary text, including a preamble before structured headings.
    let text = "";
    while (i < lines.length && !lines[i].trim().startsWith("## ")) {
      text += lines[i] + "\n";
      i++;
    }
    if (text.trim()) blocks.push({ type: "section", title: "Lesson", text: stripMd(text) });
  }
  return blocks;
}

export function LessonContentRenderer({ content }: { content: string }) {
  const blocks = parseContent(content);
  return (
    <div className="space-y-8">
      {blocks.map((block, idx) => {
        if (block.type === "objectives") {
          return (
            <ObjectivesBlock key={idx}>
              {block.items.map((item: string, i: number) => (
                <ObjectiveItem key={i}>{item}</ObjectiveItem>
              ))}
            </ObjectivesBlock>
          );
        }
        if (block.type === "concepts") {
          return (
            <KeyConceptsBlock key={idx}>
              {block.items.map((item: string, i: number) => (
                <KeyConceptChip key={i}>{item}</KeyConceptChip>
              ))}
            </KeyConceptsBlock>
          );
        }
        if (block.type === "callout") {
          return (
            <Callout key={idx} type={block.kind} title={block.title}>
              {block.text}
            </Callout>
          );
        }
        if (block.type === "section") {
          return (
            <Section key={idx} title={block.title}>
              <p className="whitespace-pre-wrap">{block.text}</p>
            </Section>
          );
        }
        if (block.type === "exercise") {
          return (
            <ExerciseBlock key={idx}>
              <ol className="space-y-2">
                {block.items.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-400">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </ExerciseBlock>
          );
        }
        if (block.type === "review") {
          return <ReviewQuestionsBlock key={idx} questions={block.items} />;
        }
        if (block.type === "takeaways") {
          return (
            <TakeawaysBlock key={idx}>
              {block.items.map((item: string, i: number) => (
                <TakeawayItem key={i}>{item}</TakeawayItem>
              ))}
            </TakeawaysBlock>
          );
        }
        if (block.type === "summary") {
          return (
            <section key={idx} className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="space-y-3 p-6 sm:p-8">
                <div>
                  <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Lesson Summary</p>
                  <h2 className="mt-2 font-display text-[22px] font-bold uppercase tracking-[0.03em] text-white">In Review</h2>
                </div>
                <p className="text-[16px] leading-relaxed text-white/80">{block.text}</p>
              </div>
            </section>
          );
        }
        return null;
      })}
      <div className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 p-4">
        <p className="text-[13px] leading-relaxed text-white/80">
          <strong className="text-white">Important:</strong> Trading involves financial risk. Education does not guarantee financial results. Never risk money you cannot afford to lose.
        </p>
      </div>
    </div>
  );
}
