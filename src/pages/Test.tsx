const Test = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Test Page</h1>
        <p className="text-slate-300">If you can see this, the app is working!</p>
        <div className="mt-4 text-sm text-slate-400">
          Environment: {import.meta.env.MODE}
        </div>
      </div>
    </div>
  );
};

export default Test;