type LoaderProps = {
  count?: number;
};

const defaultCount = 3;

export default function ChatLoader({ count }: LoaderProps) {
  return Array(count || defaultCount).fill(0).map((_, i) => (
    <div className="flex items-center gap-4" key={i}>
      <div className="skeleton h-12 w-12 shrink-0 rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="skeleton h-2 w-20" />
        <div className="skeleton h-2 w-40" />
      </div>
    </div>
  ));
}
