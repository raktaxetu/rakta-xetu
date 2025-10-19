interface PromptSuggestionsProps {
  label: string;
  append: (message: { role: "user"; content: string }) => void;
  suggestions: string[];
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-start text-2xl font-light text-neutral-500">
        {label}
      </h2>
      <div className="flex gap-6 text-sm flex-wrap max-[525px]:flex-col">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="h-max cursor-pointer flex-1 rounded-lg shadow-xs border bg-background p-3 hover:bg-neutral-50"
          >
            <p className="text-neutral-500 font-light">{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
