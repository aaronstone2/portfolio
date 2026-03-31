export default function FlowNodePage() {
  return (
    <div className="h-screen w-full relative">
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white mx-auto" />
          <p className="text-sm text-slate-500 font-mono">Loading FlowNode...</p>
        </div>
      </div>
      <iframe
        src="https://flownode-ui-react.vercel.app/"
        className="relative z-10 h-full w-full border-0"
        title="FlowNode DAG Builder"
        loading="lazy"
      />
    </div>
  )
}
