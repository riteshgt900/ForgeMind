export interface ContextBudget {
  maxChars: number;
  reserveChars: number;
}

export class ContextAutopilot {
  /** Trims context sections to fit budget. */
  buildContext(sections: string[], budget: ContextBudget): string {
    const limit = Math.max(0, budget.maxChars - budget.reserveChars);
    const out: string[] = [];
    let len = 0;
    for (const section of sections) {
      if (len + section.length <= limit) {
        out.push(section);
        len += section.length;
      } else {
        const remaining = limit - len;
        if (remaining > 0) {
          out.push(`${section.slice(0, remaining)}\n...[trimmed]`);
        }
        break;
      }
    }
    return out.join('\n\n');
  }
}
