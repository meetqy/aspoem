export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="container m-auto flex h-screen min-h-screen space-x-4">
      <ul className="menu menu-lg h-full w-72 rounded-box bg-base-200">
        <div className="h-20"></div>
        <li>
          <a>菜单一</a>
        </li>
        <li>
          <a>菜单二</a>
        </li>
        <li>
          <a>菜单三</a>
        </li>
      </ul>
      <main className="flex flex-1 items-center justify-center rounded-box">
        {children}
      </main>
      <aside className="flex w-72 flex-col rounded-box bg-base-200"></aside>
    </div>
  );
}
