

export default async function NeutralMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full h-full p-5">{children}</div>;
}
