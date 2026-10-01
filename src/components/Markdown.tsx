import { Fragment, type ReactNode } from "react";

/** Minimal, dependency-free markdown renderer: ###, -, **bold**, paragraphs. */
function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>,
  );
}

export default function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const out: ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];

  const flushList = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`}>
          {list.map((l, i) => (
            <li key={i}>{inline(l)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  const flushPara = () => {
    if (para.length) {
      out.push(<p key={`p-${out.length}`}>{inline(para.join(" "))}</p>);
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("### ")) {
      flushList();
      flushPara();
      out.push(<h3 key={`h-${out.length}`}>{inline(line.slice(4))}</h3>);
    } else if (/^[-•] /.test(line)) {
      flushPara();
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
      flushPara();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushList();
  flushPara();

  return <div className="prose-fa text-sm text-ink-2">{out}</div>;
}
