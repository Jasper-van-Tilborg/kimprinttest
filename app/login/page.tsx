'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '../../lib/database';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isLogin) {
      // Login logica
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // Succesvol ingelogd als admin
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', formData.username);
        localStorage.setItem('userRole', 'admin');
        router.push('/dashboard');
      } else {
        // Probeer in te loggen als klant
        try {
          const user = await db.authenticateUser(formData.username, formData.password);
          if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', user.email);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userId', user.id);
            
            if (user.role === 'admin') {
              router.push('/dashboard');
            } else {
              router.push('/'); // Klanten gaan naar de hoofdpagina
            }
          } else {
            setError('Ongeldige gebruikersnaam of wachtwoord');
          }
        } catch (error) {
          console.error('Login error:', error);
          setError('Er is een fout opgetreden bij het inloggen');
        }
      }
    } else {
      // Registratie logica
      if (formData.password !== formData.confirmPassword) {
        setError('Wachtwoorden komen niet overeen');
        setIsLoading(false);
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Wachtwoord moet minimaal 6 karakters bevatten');
        setIsLoading(false);
        return;
      }

      if (!formData.email || !formData.email.includes('@')) {
        setError('Voer een geldig e-mailadres in');
        setIsLoading(false);
        return;
      }

      try {
        // Maak een nieuwe klant aan in de database
        const newCustomer = await db.createUser({
          email: formData.email,
          password_hash: formData.password, // In productie zou je dit hashen
          first_name: formData.firstName || undefined,
          last_name: formData.lastName || undefined,
          role: 'customer'
        });

        if (newCustomer) {
          // Succesvol geregistreerd
          alert('Registratie succesvol! Je kunt nu inloggen.');
          setIsLogin(true);
          setFormData({
            username: '',
            password: '',
            email: '',
            confirmPassword: '',
            firstName: '',
            lastName: ''
          });
        } else {
          setError('Er is een fout opgetreden bij de registratie. Probeer het opnieuw.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setError('Er is een fout opgetreden bij de registratie. Probeer het opnieuw.');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1ED' }}>
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#2D1B0E' }}>
            K-imprint
          </h1>
          <p className="text-lg" style={{ color: '#4A3E2E' }}>
            {isLogin ? 'Welkom terug' : 'Maak een account aan'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: '#2D1B0E' }}>
                {isLogin ? 'E-mailadres' : 'Gebruikersnaam'}
              </label>
              <input
                type={isLogin ? 'email' : 'text'}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 placeholder:text-gray-500"
                style={{ 
                  borderColor: '#A68B6B',
                  '--tw-ring-color': '#A68B6B'
                } as React.CSSProperties}
                placeholder={isLogin ? 'Voer je e-mailadres in' : 'Voer je gebruikersnaam in'}
              />
            </div>

            {/* Email (alleen bij registratie) */}
            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2D1B0E' }}>
                  E-mailadres *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-gray-900 placeholder:text-gray-500"
                  style={{ 
                    borderColor: '#A68B6B',
                  }}
                  placeholder="Voer je e-mailadres in"
                />
              </div>
            )}

            {/* First Name (alleen bij registratie) */}
            {!isLogin && (
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: '#2D1B0E' }}>
                  Voornaam
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-gray-900 placeholder:text-gray-500"
                  style={{ 
                    borderColor: '#A68B6B',
                  }}
                  placeholder="Voer je voornaam in (optioneel)"
                />
              </div>
            )}

            {/* Last Name (alleen bij registratie) */}
            {!isLogin && (
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: '#2D1B0E' }}>
                  Achternaam
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-gray-900 placeholder:text-gray-500"
                  style={{ 
                    borderColor: '#A68B6B',
                  }}
                  placeholder="Voer je achternaam in (optioneel)"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#2D1B0E' }}>
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 placeholder:text-gray-500"
                style={{ 
                  borderColor: '#A68B6B',
                  '--tw-ring-color': '#A68B6B'
                } as React.CSSProperties}
                placeholder="Voer je wachtwoord in"
              />
            </div>

            {/* Confirm Password (alleen bij registratie) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: '#2D1B0E' }}>
                  Bevestig wachtwoord
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors text-gray-900 placeholder:text-gray-500"
                  style={{ 
                    borderColor: '#A68B6B',
                  }}
                  placeholder="Bevestig je wachtwoord"
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 p-3 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                backgroundColor: '#2D1B0E',
                boxShadow: '0 4px 14px 0 rgba(45, 27, 14, 0.3)'
              }}
            >
              {isLoading ? 'Bezig...' : (isLogin ? 'Inloggen' : 'Registreren')}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#4A3E2E' }}>
              {isLogin ? 'Nog geen account?' : 'Al een account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    username: '',
                    password: '',
                    email: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: ''
                  });
                }}
                className="ml-1 font-medium hover:underline"
                style={{ color: '#8B6F47' }}
              >
                {isLogin ? 'Registreer hier' : 'Log hier in'}
              </button>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="text-sm font-medium hover:underline"
              style={{ color: '#8B6F47' }}
            >
              ← Terug naar hoofdpagina
            </Link>
          </div>
        </div>

        {/* Demo credentials */}
        {isLogin && (
          <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#E8DDD4', borderColor: '#D9C1B5' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold" style={{ color: '#2D1B0E' }}>Demo inloggegevens</span>
              </div>
              <div className="text-sm space-y-1" style={{ color: '#4A3E2E' }}>
                <div><strong>Admin:</strong> admin / admin123</div>
                <div><strong>Klant:</strong> Gebruik je e-mailadres en wachtwoord</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
