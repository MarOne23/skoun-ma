export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary mb-2">S&apos;identifier</h1>
        <p className="text-gray-500 mb-6">Connectez-vous à votre compte Skoun.ma</p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="votre@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mot de passe</label>
            <input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-light transition-colors">
            Se connecter
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-primary font-medium hover:underline">S&apos;inscrire</a>
        </p>
      </div>
    </main>
  );
}
