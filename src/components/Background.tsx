
export function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"
      />
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-blue-900/10 to-transparent"
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
    </div>
  );
}
