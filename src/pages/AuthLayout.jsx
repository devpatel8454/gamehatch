function AuthLayout({ children, title }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100">
        <img
          src="/src/assets/dcae66764a7bd4d470bd2446f062b1ff.jpg"
          alt="Ecommerce"
          className="w-3/4 object-contain"
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
